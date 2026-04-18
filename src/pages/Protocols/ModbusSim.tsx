import { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge, Input } from '@/components/ui';
import { 
  Activity, 
  Globe, Zap, Terminal,
  Settings, Database, Play, Square,
  Wifi, WifiOff, RefreshCw, Layers,
  ChevronRight, Binary, Hash
} from 'lucide-react';
import mqtt, { MqttClient } from 'mqtt';

// ==========================================
// TYPES & INTERFACES
// ==========================================
interface ModbusResult {
  address: number;
  value: number;
  hex: string;
  binary: string;
}

type FunctionCode = 
  | 'read_coils' 
  | 'read_discrete' 
  | 'read_holding' 
  | 'read_input'
  | 'write_coil'
  | 'write_register'
  | 'write_coils'
  | 'write_registers';

interface TrafficLog {
  id: string;
  timestamp: string;
  msg: string;
  type: 'req' | 'res' | 'info' | 'error';
}

export function ModbusSim() {
  // Core State
  const [mode, setMode] = useState<'virtual' | 'hardware'>('virtual');
  const [role, setRole] = useState<'master' | 'slave'>('master');
  const [isBridgeOnline, setIsBridgeOnline] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Connection Settings
  const [transport, setTransport] = useState<'tcp' | 'rtu'>('tcp');
  const [localIp, setLocalIp] = useState(`192.168.1.${Math.floor(Math.random() * 254) + 1}`);
  const [targetIp, setTargetIp] = useState('192.168.1.10');
  const [port, setPort] = useState(502);
  const [slaveId, setSlaveId] = useState(1);

  // Operations State
  const [selectedFC, setSelectedFC] = useState<FunctionCode>('read_holding');
  const [opAddress, setOpAddress] = useState(0);
  const [opCount, setOpCount] = useState(1);
  const [opValue, setOpValue] = useState('');
  const [isPolling, setIsPolling] = useState(false);
  
  // Results & Logs
  const [results, setResults] = useState<ModbusResult[]>([]);
  const [traffic, setTraffic] = useState<TrafficLog[]>([]);
  
  // Refs
  const clientRef = useRef<MqttClient | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ==========================================
  // UTILS
  // ==========================================
  const addLog = (msg: string, type: 'req' | 'res' | 'info' | 'error' = 'info') => {
    const newLog: TrafficLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      msg,
      type
    };
    setTraffic(prev => [newLog, ...prev].slice(0, 50));
  };

  const toHex = (val: number) => '0x' + (val || 0).toString(16).toUpperCase().padStart(4, '0');
  const toBinary = (val: number) => (val || 0).toString(2).padStart(16, '0').replace(/(.{4})/g, '$1 ').trim();

  // ==========================================
  // BRIDGE (HARDWARE) LOGIC
  // ==========================================
  useEffect(() => {
    const checkBridge = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/status');
        if (res.ok) {
          const data = await res.json();
          setIsBridgeOnline(true);
          if (data.connected) {
            setIsConnected(true);
          } else {
            setIsConnected(false);
          }
        } else {
          setIsBridgeOnline(false);
          setIsConnected(false);
        }
      } catch {
        setIsBridgeOnline(false);
        setIsConnected(false);
      }
    };

    const timer = setInterval(checkBridge, 3000);
    checkBridge();
    return () => clearInterval(timer);
  }, []);

  const handleHardwareConnect = async () => {
    try {
      addLog(`Connecting to Hardware Bridge @ localhost:5000...`, 'info');
      const res = await fetch('http://127.0.0.1:5000/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: role,
          transport,
          config: {
            host: targetIp,
            port: port,
            slave_id: slaveId
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsConnected(true);
        addLog(`Connected to ${transport.toUpperCase()} ${role.toUpperCase()} via Bridge`, 'res');
      } else {
        addLog(`Connection Failed: ${data.error}`, 'error');
      }
    } catch (e) {
      addLog(`Bridge Unreachable. Ensure Python backend is running.`, 'error');
    }
  };

  const handleHardwareDisconnect = async () => {
    try {
      await fetch('http://127.0.0.1:5000/api/disconnect', { method: 'POST' });
      setIsConnected(false);
      addLog(`Disconnected from Bridge`, 'info');
    } catch (e) { console.error(e); }
  };

  // ==========================================
  // VIRTUAL (MQTT) LOGIC
  // ==========================================
  useEffect(() => {
    if (mode !== 'virtual') return;

    const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
      clientId: `plts_modbus_${Math.random().toString(16).slice(2, 8)}`,
    });
    clientRef.current = client;

    client.on('connect', () => {
      client.subscribe(`plts/modbus/ip/${localIp}/#`);
      addLog(`VIRTUAL NETWORK ONLINE: IP ${localIp}`, 'info');
    });

    client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        if (topic.endsWith('/res')) {
          addLog(`RCV RES from ${data.srcIp} [FC:${data.fc}]`, 'res');
          const modbusResults: ModbusResult[] = (data.data as number[]).map((val, idx) => ({
            address: (data.startAddress || opAddress) + idx,
            value: val,
            hex: toHex(val),
            binary: toBinary(val)
          }));
          setResults(modbusResults);
        }
      } catch (e) { console.error(e); }
    });

    return () => { client.end(); };
  }, [mode, localIp, opAddress]);

  // ==========================================
  // EXECUTION LOGIC
  // ==========================================
  const executeOperation = async () => {
    if (!isConnected && mode === 'hardware') return;

    if (mode === 'hardware') {
      try {
        addLog(`${selectedFC.toUpperCase()} @ ${opAddress}`, 'req');
        const res = await fetch('http://127.0.0.1:5000/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            function: selectedFC,
            slave_id: slaveId,
            address: opAddress,
            count: opCount,
            values: opValue.split(',').filter(v => v.trim()).map(v => v.trim())
          })
        });
        const data = await res.json();
        if (data.success) {
          addLog(`SUCCESS: ${data.values ? data.values.length : 1} items`, 'res');
          if (data.values) {
            const modbusResults: ModbusResult[] = (data.values as number[]).map((val, idx) => ({
              address: opAddress + idx,
              value: val,
              hex: toHex(val),
              binary: toBinary(val)
            }));
            setResults(modbusResults);
          }
        } else {
          addLog(`ERR: ${data.error}`, 'error');
        }
      } catch (e) { addLog(`Execution Failed`, 'error'); }
    } else {
      // Virtual Mode simulation
      addLog(`VIRTUAL REQ: ${selectedFC.toUpperCase()}`, 'req');
      setTimeout(() => {
        const count = ['write_coil', 'write_register'].includes(selectedFC) ? 1 : opCount;
        const mockValues = Array.from({ length: count }, () => Math.floor(Math.random() * 1000));
        setResults(mockValues.map((v, i) => ({
          address: opAddress + i,
          value: v,
          hex: toHex(v),
          binary: toBinary(v)
        })));
        addLog(`VIRTUAL RES: OK (Simulated)`, 'res');
      }, 300);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-700">
      
      {/* TOP BAR / NAVIGATION */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-bg-surface p-6 rounded-3xl border border-border-accent/20 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-5 relative z-10">
          <div className={`p-4 rounded-2xl shadow-inner transition-all duration-500 bg-bg-elevated ${isBridgeOnline ? 'text-accent' : 'text-text-dim'}`}>
            <Activity className={isPolling ? 'animate-pulse' : ''} size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={mode === 'hardware' ? 'primary' : 'outline'} className="uppercase font-black text-[9px] tracking-widest px-3 py-1">
                {mode === 'hardware' ? 'Industrial Mode' : 'Training Mode'}
              </Badge>
              {mode === 'hardware' && (
                <div className="flex items-center gap-1.5 ml-2">
                  <div className={`w-2 h-2 rounded-full ${isBridgeOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-tight text-text-muted">
                    Bridge: {isBridgeOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
              )}
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tighter uppercase italic">
              Modbus<span className="text-accent underline decoration-accent/30 ml-2">Studio Pro</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 p-1.5 bg-bg-elevated rounded-2xl border border-border shadow-inner">
          <Button 
            size="sm" 
            variant={mode === 'virtual' ? 'primary' : 'ghost'} 
            onClick={() => setMode('virtual')}
            className={`rounded-xl px-5 h-10 font-bold text-xs ${mode === 'virtual' ? '' : 'text-text-dim'}`}
          >
            <Globe size={14} className="mr-2" /> VIRTUAL
          </Button>
          <Button 
            size="sm" 
            variant={mode === 'hardware' ? 'primary' : 'ghost'} 
            onClick={() => setMode('hardware')}
            className={`rounded-xl px-5 h-10 font-bold text-xs ${mode === 'hardware' ? '' : 'text-text-dim'}`}
          >
            <Zap size={14} className="mr-2" /> HARDWARE
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SIDE PANEL: CONNECTION & STATUS */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-6 border-border-accent/20 bg-bg-surface shadow-lg">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
              <Settings size={18} className="text-accent" />
              <h2 className="text-xs font-black uppercase tracking-widest text-text-primary">Connection Node</h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-text-dim flex items-center justify-between">
                  <span>Transport Protocol</span>
                  <Badge variant="outline" className="text-[8px] px-1 h-4">{transport.toUpperCase()}</Badge>
                </label>
                <div className="grid grid-cols-2 gap-2 bg-bg-elevated p-1 rounded-xl border border-border/50">
                  <button onClick={() => setTransport('tcp')} className={`py-2 text-[10px] font-black rounded-lg transition-all ${transport === 'tcp' ? 'bg-bg-surface text-accent shadow-sm' : 'text-text-dim hover:text-text-primary'}`}>TCP/IP</button>
                  <button onClick={() => setTransport('rtu')} className={`py-2 text-[10px] font-black rounded-lg transition-all ${transport === 'rtu' ? 'bg-bg-surface text-accent shadow-sm' : 'text-text-dim hover:text-text-primary'}`}>RTU/COM</button>
                </div>
              </div>

              {transport === 'tcp' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-text-dim">IP Address / Host</label>
                    <div className="relative group">
                      <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-accent transition-colors" size={14} />
                      <Input 
                        value={targetIp} 
                        onChange={e => setTargetIp(e.target.value)} 
                        className="pl-9 h-11 bg-bg-elevated border-border/50 font-mono text-xs focus:ring-accent/20" 
                        placeholder="192.168.1.10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-text-dim">Network Port</label>
                    <Input 
                      type="number" 
                      value={port} 
                      onChange={e => setPort(Number(e.target.value))} 
                      className="h-11 bg-bg-elevated border-border/50 font-mono text-xs" 
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-text-dim">Serial Port / Device</label>
                  <Input 
                    value={targetIp} 
                    onChange={e => setTargetIp(e.target.value)} 
                    className="h-11 bg-bg-elevated border-border/50 font-mono text-xs" 
                    placeholder="COM3 or /dev/ttyUSB0"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-text-dim">Slave Device ID (1-247)</label>
                <Input 
                  type="number" 
                  value={slaveId} 
                  onChange={e => setSlaveId(Number(e.target.value))} 
                  className="h-11 bg-bg-elevated border-border/50 font-mono text-xs" 
                />
              </div>

              <div className="pt-4 border-t border-border/50 space-y-3">
                {mode === 'hardware' ? (
                  <>
                    <Button 
                      onClick={isConnected ? handleHardwareDisconnect : handleHardwareConnect}
                      variant={isConnected ? 'danger' : 'primary'}
                      disabled={!isBridgeOnline}
                      className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg"
                    >
                      {isConnected ? (
                        <><WifiOff size={16} className="mr-2" /> DISCONNECT</>
                      ) : (
                        <><Play size={16} className="mr-2" /> CONNECT TO HUB</>
                      )}
                    </Button>
                    {!isBridgeOnline && (
                      <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/20">
                        <p className="text-[9px] text-red-500 font-bold text-center leading-tight">
                          Python Backend is OFFLINE.<br/> Please run start_modbus_studio.bat
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <Badge variant="outline" className="w-full py-4 rounded-xl flex justify-center bg-accent/5 font-bold text-[10px] text-accent border-accent/20 border">
                    VIRTUAL NETWORK ACTIVE
                  </Badge>
                )}
              </div>
            </div>
          </Card>

          {/* TRAFFIC LOG / SNIFFER */}
          <Card className="flex flex-col h-[400px] overflow-hidden border-border/40 shadow-xl bg-black/40 backdrop-blur-md">
            <div className="p-4 bg-bg-elevated/50 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">Traffic Sniffer</span>
              </div>
              <button 
                onClick={() => setTraffic([])}
                className="text-[9px] font-black text-text-dim hover:text-accent transition-colors"
              >
                CLEAR
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono scrollbar-vibrant">
              {traffic.map(t => (
                <div key={t.id} className="text-[9px] flex flex-col gap-1 border-b border-white/5 pb-2 last:border-0">
                  <div className="flex items-center justify-between opacity-50">
                    <span className="text-[8px]">{t.timestamp}</span>
                    <span className={`text-[8px] font-bold ${t.type === 'req' ? 'text-amber-400' : t.type === 'res' ? 'text-emerald-400' : t.type === 'error' ? 'text-red-400' : 'text-accent'}`}>
                      {t.type.toUpperCase()}
                    </span>
                  </div>
                  <p className={`leading-tight ${t.type === 'error' ? 'text-red-400' : 'text-text-muted'}`}>
                    {t.msg}
                  </p>
                </div>
              ))}
              {traffic.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-10">
                  <Database size={48} className="mb-4" />
                  <p className="text-[10px] uppercase font-black tracking-widest text-text-dim">Waiting for traffic...</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* MAIN AREA: FUNCTIONS & RESULTS */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* FUNCTION SELECTION CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'read_coils', name: 'Read Coils', fc: '01', desc: 'Read Digital Out', icon: <Zap size={18} /> },
              { id: 'read_discrete', name: 'Read Discrete', fc: '02', desc: 'Read Digital In', icon: <Zap size={18} /> },
              { id: 'read_holding', name: 'Read Holding', fc: '03', desc: 'Read Analog Out', icon: <Activity size={18} /> },
              { id: 'read_input', name: 'Read Input', fc: '04', desc: 'Read Analog In', icon: <Activity size={18} /> },
              { id: 'write_coil', name: 'Write Coil', fc: '05', desc: 'Write 1 Binary', icon: <ChevronRight size={18} /> },
              { id: 'write_register', name: 'Write Register', fc: '06', desc: 'Write 1 Word', icon: <ChevronRight size={18} /> },
              { id: 'write_coils', name: 'Write Mult. Coils', fc: '15', desc: 'Write N Binary', icon: <Layers size={18} /> },
              { id: 'write_registers', name: 'Write Mult. Reg', fc: '16', desc: 'Write N Word', icon: <Layers size={18} /> },
            ].map(fn => (
              <div 
                key={fn.id}
                onClick={() => setSelectedFC(fn.id as FunctionCode)}
                className={`
                  p-5 rounded-3xl cursor-pointer transition-all duration-300 border-2 select-none relative overflow-hidden group
                  ${selectedFC === fn.id 
                    ? 'bg-accent/10 border-accent shadow-lg shadow-accent/10 translate-y-[-4px]' 
                    : 'bg-bg-surface border-border hover:border-accent/40 hover:bg-bg-elevated/50'}
                `}
              >
                <div className={`absolute top-2 right-2 text-[10px] font-black font-mono px-2 py-0.5 rounded-lg ${selectedFC === fn.id ? 'bg-accent text-bg' : 'bg-bg-elevated text-text-dim'}`}>
                  FC {fn.fc}
                </div>
                <div className={`mb-3 w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${selectedFC === fn.id ? 'bg-accent text-bg' : 'bg-bg-elevated text-text-muted group-hover:text-accent'}`}>
                  {fn.icon}
                </div>
                <h3 className={`text-xs font-black uppercase mb-1 ${selectedFC === fn.id ? 'text-accent' : 'text-text-primary'}`}>{fn.name}</h3>
                <p className="text-[10px] text-text-dim leading-tight">{fn.desc}</p>
              </div>
            ))}
          </div>

          {/* OPERATION PANEL */}
          <Card className="p-8 border-border shadow-xl bg-bg-surface overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <RefreshCw size={120} className={isPolling ? 'animate-spin-slow text-accent' : 'text-text-dim'} />
            </div>
            
            <div className="flex flex-col md:flex-row items-end gap-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 w-full">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-text-dim flex items-center gap-2">
                    <Hash size={12} /> Start Address
                  </label>
                  <Input 
                    type="number" 
                    value={opAddress} 
                    onChange={e => setOpAddress(Number(e.target.value))}
                    className="h-12 bg-bg-elevated font-mono font-bold border-none text-xl" 
                  />
                </div>
                
                {['write_coil', 'write_register'].includes(selectedFC) ? (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-text-dim">Value to Write</label>
                    <Input 
                      value={opValue} 
                      onChange={e => setOpValue(e.target.value)}
                      placeholder={selectedFC.includes('coil') ? "0 or 1" : "e.g. 12345"}
                      className="h-12 bg-bg-elevated font-mono font-bold border-none text-xl" 
                    />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-text-dim">Count / Quantity</label>
                      <Input 
                        type="number" 
                        value={opCount} 
                        onChange={e => setOpCount(Number(e.target.value))}
                        className="h-12 bg-bg-elevated font-mono font-bold border-none text-xl" 
                      />
                    </div>
                    {selectedFC.includes('write') && (
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-text-dim">Values (CSV)</label>
                         <Input 
                           value={opValue} 
                           onChange={e => setOpValue(e.target.value)}
                           placeholder="10, 20, 30..."
                           className="h-12 bg-bg-elevated font-mono text-sm border-none" 
                         />
                       </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <Button 
                   onClick={executeOperation}
                   disabled={mode === 'hardware' && !isConnected}
                   className="h-14 px-10 rounded-2xl bg-accent text-bg font-black uppercase tracking-widest text-[12px] shadow-xl hover:shadow-accent/20 active:scale-95 transition-all"
                >
                  <Play size={18} className="mr-2" /> Execute
                </Button>
                {selectedFC.startsWith('read') && (
                  <Button 
                    onClick={() => {
                      if (isPolling) {
                        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
                        setIsPolling(false);
                      } else {
                        setIsPolling(true);
                        pollIntervalRef.current = setInterval(executeOperation, 2000);
                      }
                    }}
                    variant={isPolling ? 'danger' : 'ghost'}
                    disabled={mode === 'hardware' && !isConnected}
                    className={`h-14 w-14 rounded-2xl p-0 flex items-center justify-center border-2 ${isPolling ? 'bg-red-500 border-red-500 text-white' : ''}`}
                  >
                    {isPolling ? <Square size={20} fill="currentColor" /> : <RefreshCw size={20} />}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* RESULTS TABLE */}
          <Card className="min-h-[400px] border-border shadow-2xl overflow-hidden bg-bg-surface">
            <div className="bg-bg-elevated/50 p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                   <Binary size={18} />
                </div>
                <div>
                  <h2 className="text-xs font-black uppercase tracking-widest text-text-primary">Data Monitoring</h2>
                  <p className="text-[10px] text-text-dim font-mono">Real-time memory viewer</p>
                </div>
              </div>
              {results.length > 0 && (
                <div className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-500/20">
                  {results.length} REGISTERS
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-elevated/20">
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-text-dim border-b border-border">Address</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-text-dim border-b border-border">Dec Value</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-text-dim border-b border-border text-accent">Hexadecimal</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-text-dim border-b border-border">Binary Representation (16-bit)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {results.map((res) => (
                    <tr key={res.address} className="hover:bg-accent/5 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-black text-text-dim bg-bg-elevated px-2 py-1 rounded-md group-hover:text-accent transition-colors">
                          {res.address.toString().padStart(5, '0')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-lg font-bold text-text-primary">
                          {res.value}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-bold text-accent">
                          {res.hex}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-[11px] text-text-dim tracking-wider">
                          {res.binary.split(' ').map((chunk, i) => (
                            <span key={i} className={chunk.includes('1') ? 'text-accent/80' : ''}>
                              {chunk}{' '}
                            </span>
                          ))}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {results.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center italic text-text-dim opacity-40">
                         <div className="flex flex-col items-center gap-4">
                            <RefreshCw size={48} className="animate-spin-slow opacity-20" />
                            <p className="text-sm font-bold uppercase tracking-widest font-mono">Ready to scan memory...</p>
                         </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
