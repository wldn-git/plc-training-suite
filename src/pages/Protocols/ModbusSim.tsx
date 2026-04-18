import { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge, Input } from '@/components/ui';
import { 
  Activity, 
  Globe, Zap, Terminal,
  Settings, Database, Play, Square,
  Wifi, WifiOff, RefreshCw, Layers,
  ChevronRight, Binary, Hash, Layout, Eye
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

interface SlaveData {
  coils: number[];
  discrete_inputs: number[];
  holding_registers: number[];
  input_registers: number[];
}

export function ModbusSim() {
  // Core State
  const [mode, setMode] = useState<'virtual' | 'hardware'>('virtual');
  const [role, setRole] = useState<'master' | 'slave'>('master');
  const [isBridgeOnline, setIsBridgeOnline] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Connection Settings
  const [transport, setTransport] = useState<'tcp' | 'rtu'>('tcp');
  const [localIp] = useState(`192.168.1.${Math.floor(Math.random() * 254) + 1}`);
  const [targetIp, setTargetIp] = useState('192.168.1.10');
  const [port, setPort] = useState(502);
  const [slaveId, setSlaveId] = useState(1);

  // Operations State
  const [selectedFC, setSelectedFC] = useState<FunctionCode>('read_holding');
  const [opAddress, setOpAddress] = useState(0);
  const [opCount, setOpCount] = useState(1);
  const [opValue, setOpValue] = useState('');
  const [isPolling, setIsPolling] = useState(false);
  
  // Results & Data Store
  const [results, setResults] = useState<ModbusResult[]>([]);
  const [slaveData, setSlaveData] = useState<SlaveData | null>(null);
  const [traffic, setTraffic] = useState<TrafficLog[]>([]);
  
  // Refs
  const clientRef = useRef<MqttClient | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
  // BRIDGE (HARDWARE) SYNC LOGIC
  // ==========================================
  useEffect(() => {
    const checkBridge = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/status');
        if (res.ok) {
          const data = await res.json();
          setIsBridgeOnline(true);
          setIsConnected(data.connected);
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

  // Sync slave data if in slave mode and connected
  useEffect(() => {
    if (mode === 'hardware' && isConnected && role === 'slave') {
      const fetchDatastore = async () => {
        try {
          const res = await fetch('http://127.0.0.1:5000/api/datastore');
          const data = await res.json();
          if (data.success) {
            setSlaveData(data.data);
          }
        } catch (e) {
          console.error('Datastore sync failed', e);
        }
      };
      syncIntervalRef.current = setInterval(fetchDatastore, 1000);
      return () => { if (syncIntervalRef.current) clearInterval(syncIntervalRef.current); };
    } else {
      setSlaveData(null);
    }
  }, [mode, isConnected, role]);

  const handleHardwareConnect = async () => {
    try {
      addLog(`Connecting to Hardware Bridge...`, 'info');
      const res = await fetch('http://127.0.0.1:5000/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: role,
          transport,
          config: {
            host: role === 'master' ? targetIp : '0.0.0.0',
            port: port,
            slave_id: slaveId
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsConnected(true);
        addLog(`SUCCESS: ${role.toUpperCase()} mode active`, 'res');
      } else {
        addLog(`ERR: ${data.error}`, 'error');
      }
    } catch (e) {
      addLog(`Bridge Unreachable. Run start_modbus_studio.bat`, 'error');
    }
  };

  const handleHardwareDisconnect = async () => {
    try {
      await fetch('http://127.0.0.1:5000/api/disconnect', { method: 'POST' });
      setIsConnected(false);
      addLog(`DISCONNECTED`, 'info');
    } catch (e) { console.error(e); }
  };

  // ==========================================
  // VIRTUAL LOGIC (MQTT)
  // ==========================================
  useEffect(() => {
    if (mode !== 'virtual') return;
    const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
      clientId: `plts_mbs_${Math.random().toString(16).slice(2, 8)}`,
    });
    clientRef.current = client;

    client.on('connect', () => {
      client.subscribe(`plts/modbus/ip/${localIp}/#`);
      addLog(`MQTT BUS ACTIVE @ ${localIp}`, 'info');
    });

    client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        if (topic.endsWith('/res')) {
          addLog(`RES from ${data.srcIp}`, 'res');
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

  const executeOperation = async () => {
    if (!isConnected && mode === 'hardware') return;

    if (mode === 'hardware') {
      try {
        addLog(`REQ: ${selectedFC.split('_').join(' ')}`, 'req');
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
          addLog(`RES: OK`, 'res');
          if (data.values) {
            setResults((data.values as number[]).map((val, idx) => ({
              address: opAddress + idx,
              value: val,
              hex: toHex(val),
              binary: toBinary(val)
            })));
          }
        } else {
          addLog(`ERR: ${data.error}`, 'error');
        }
      } catch (e) { addLog(`Bridge Error`, 'error'); }
    } else {
      addLog(`VIRTUAL REQ: ${selectedFC}`, 'req');
      setTimeout(() => {
        const count = ['write_coil', 'write_register'].includes(selectedFC) ? 1 : opCount;
        const mock = Array.from({ length: count }, () => Math.floor(Math.random() * 1000));
        setResults(mock.map((v, i) => ({
          address: opAddress + i,
          value: v,
          hex: toHex(v),
          binary: toBinary(v)
        })));
        addLog(`SIMULATED RES OK`, 'res');
      }, 300);
    }
  };

  const renderBitGrid = (title: string, values: number[], baseAddr: number, color: string) => (
    <div className="bg-bg-elevated/40 p-4 rounded-2xl border border-border/50">
      <h4 className="text-[10px] font-black uppercase text-text-dim mb-3 flex items-center justify-between">
        <span>{title}</span>
        <span className="text-accent">0x / 1x</span>
      </h4>
      <div className="grid grid-cols-8 gap-1.5">
        {values.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`
              w-full h-8 rounded-lg flex items-center justify-center font-mono text-[10px] font-black transition-all border
              ${v === 1 ? `${color} text-bg shadow-lg` : 'bg-bg-surface text-text-muted border-border'}
            `}>
              {v}
            </div>
            <span className="text-[8px] font-mono opacity-40">{baseAddr + i}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRegisterGrid = (title: string, values: number[], baseAddr: number, color: string) => (
    <div className="bg-bg-elevated/40 p-4 rounded-2xl border border-border/50">
      <h4 className="text-[10px] font-black uppercase text-text-dim mb-3 flex items-center justify-between">
        <span>{title}</span>
        <span className="text-accent">3x / 4x</span>
      </h4>
      <div className="grid grid-cols-4 gap-2">
        {values.map((v, i) => (
          <div key={i} className="bg-bg-surface p-2 rounded-xl border border-border/50 flex flex-col group hover:border-accent/40 transition-colors">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[8px] font-mono text-text-dim">{baseAddr + i}</span>
              <span className="text-[8px] font-mono text-accent/50">{toHex(v)}</span>
            </div>
            <span className={`text-xs font-black ${color}`}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto p-4 lg:p-8 animate-in fade-in duration-500">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-bg-surface p-6 rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-xl transition-all duration-700 bg-bg-elevated ${isBridgeOnline ? 'text-accent border border-accent/20' : 'text-text-dim'}`}>
            <Activity className={isPolling ? 'animate-pulse' : ''} size={36} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Badge variant={mode === 'hardware' ? 'accent' : 'default'} className="px-4 py-1">
                {mode === 'hardware' ? 'INDUSTRIAL' : 'TRAINING'}
              </Badge>
              <div className="flex items-center gap-1.5 ml-2 cursor-help" title={isBridgeOnline ? 'Local Bridge Active' : 'Bridge Not Detected'}>
                <div className={`w-2.5 h-2.5 rounded-full ${isBridgeOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-[10px] font-black uppercase tracking-tighter text-text-muted">LINK: {isBridgeOnline ? 'OK' : 'OFF'}</span>
              </div>
            </div>
            <h1 className="text-3xl font-black text-text-primary uppercase italic tracking-tighter">
              MODBUS<span className="text-accent ml-2 decoration-accent/20 underline">STUDIO PRO</span>
            </h1>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="flex bg-bg-elevated p-1.5 rounded-2xl shadow-inner border border-border">
            <Button size="sm" variant={role === 'master' ? 'primary' : 'ghost'} onClick={() => { setRole('master'); setIsConnected(false); }} className="rounded-xl px-6 h-10 font-black text-[10px]">
              <Layout size={14} className="mr-2" /> MASTER
            </Button>
            <Button size="sm" variant={role === 'slave' ? 'primary' : 'ghost'} onClick={() => { setRole('slave'); setIsConnected(false); }} className="rounded-xl px-6 h-10 font-black text-[10px]">
              <Eye size={14} className="mr-2" /> SLAVE
            </Button>
          </div>
          
          <div className="flex bg-bg-elevated p-1.5 rounded-2xl shadow-inner border border-border ml-2">
            <Button size="sm" variant={mode === 'virtual' ? 'accent' : 'ghost'} onClick={() => setMode('virtual')} className="rounded-xl px-4 h-10 font-black text-[10px]">
              <Globe size={14} className="mr-2" /> VIRTUAL
            </Button>
            <Button size="sm" variant={mode === 'hardware' ? 'accent' : 'ghost'} onClick={() => setMode('hardware')} className="rounded-xl px-4 h-10 font-black text-[10px]">
              <Zap size={14} className="mr-2" /> HARDWARE
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR: Connection & Sniffer */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-6 border-border shadow-xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-accent/20" />
             <div className="flex items-center gap-2 mb-6">
                <Settings size={18} className="text-accent" />
                <h2 className="text-xs font-black uppercase tracking-widest text-text-primary">Node Config</h2>
             </div>
             
             <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-text-dim">Transport</label>
                  <div className="flex bg-bg-elevated p-1 rounded-xl">
                    <button onClick={() => setTransport('tcp')} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${transport === 'tcp' ? 'bg-bg-surface text-accent shadow-md' : 'text-text-dim'}`}>TCP</button>
                    <button onClick={() => setTransport('rtu')} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${transport === 'rtu' ? 'bg-bg-surface text-accent shadow-md' : 'text-text-dim'}`}>RTU</button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-text-dim">{transport === 'tcp' ? 'Remote IP' : 'Serial Port'}</label>
                  <Input value={targetIp} onChange={e => setTargetIp(e.target.value)} className="h-11 bg-bg-elevated font-mono text-xs border-none" placeholder={transport === 'tcp' ? "127.0.0.1" : "/dev/ttyUSB0"} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-text-dim">{transport === 'tcp' ? 'Port' : 'Baud'}</label>
                    <Input type="number" value={port} onChange={e => setPort(Number(e.target.value))} className="h-11 bg-bg-elevated font-mono text-xs border-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-text-dim">Slave ID</label>
                    <Input type="number" value={slaveId} onChange={e => setSlaveId(Number(e.target.value))} className="h-11 bg-bg-elevated font-mono text-xs border-none" />
                  </div>
                </div>

                <div className="pt-4 border-t border-border/10">
                  {mode === 'hardware' ? (
                    <Button onClick={isConnected ? handleHardwareDisconnect : handleHardwareConnect} variant={isConnected ? 'danger' : 'primary'} disabled={!isBridgeOnline} className="w-full h-12 rounded-2xl font-black text-[10px]">
                      {isConnected ? <><WifiOff size={16} className="mr-2" /> STOP BRIDGE</> : <><Wifi size={16} className="mr-2" /> START BRIDGE</>}
                    </Button>
                  ) : (
                    <div className="bg-accent/5 p-4 rounded-2xl flex items-center justify-center gap-3 border border-accent/20">
                      <Network size={16} className="text-accent animate-pulse" />
                      <span className="text-[10px] font-black text-accent uppercase underline">P2P Virtual Bus Active</span>
                    </div>
                  )}
                </div>
             </div>
          </Card>

          <Card className="flex flex-col h-[400px] overflow-hidden bg-black/40 backdrop-blur-xl border-border shadow-2xl">
            <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest">Protocol Sniffer</span>
              </div>
              <button onClick={() => setTraffic([])} className="text-[9px] opacity-40 hover:opacity-100">CLEAR</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono scrollbar-vibrant">
              {traffic.map(t => (
                <div key={t.id} className={`text-[9px] p-2 rounded-lg border-l-2 ${t.type === 'req' ? 'border-amber-500 bg-amber-500/5 text-amber-200' : t.type === 'res' ? 'border-emerald-500 bg-emerald-500/5 text-emerald-200' : t.type === 'error' ? 'border-red-500 bg-red-500/5 text-red-200' : 'border-accent bg-accent/5 text-accent-dim'}`}>
                  <div className="flex justify-between mb-1 opacity-60"><span>{t.timestamp}</span><span>{t.type.toUpperCase()}</span></div>
                  <p className="leading-tight">{t.msg}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* MAIN AREA */}
        <div className="lg:col-span-9">
          {role === 'master' ? (
            <div className="space-y-6">
              {/* MASTER VIEW */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'read_coils', fc: '01', icon: <Zap /> },
                  { id: 'read_discrete', fc: '02', icon: <Zap /> },
                  { id: 'read_holding', fc: '03', icon: <Activity /> },
                  { id: 'read_input', fc: '04', icon: <Activity /> },
                  { id: 'write_coil', fc: '05', icon: <ChevronRight /> },
                  { id: 'write_register', fc: '06', icon: <ChevronRight /> },
                  { id: 'write_coils', fc: '15', icon: <Layers /> },
                  { id: 'write_registers', fc: '16', icon: <Layers /> },
                ].map(fn => (
                  <div key={fn.id} onClick={() => setSelectedFC(fn.id as FunctionCode)} className={`p-5 rounded-3xl cursor-pointer transition-all border-2 relative group ${selectedFC === fn.id ? 'bg-accent/5 border-accent shadow-xl -translate-y-1' : 'bg-bg-surface border-border hover:border-accent/30'}`}>
                    <div className={`p-3 rounded-2xl w-fit mb-3 transition-colors ${selectedFC === fn.id ? 'bg-accent text-bg' : 'bg-bg-elevated text-text-dim group-hover:text-accent'}`}>{fn.icon}</div>
                    <h3 className="text-xs font-black uppercase">{fn.id.split('_').join(' ')}</h3>
                    <div className="absolute top-4 right-4 text-[10px] font-black opacity-40">FC {fn.fc}</div>
                  </div>
                ))}
              </div>

              <Card className="p-8 border-border shadow-2xl bg-bg-surface overflow-hidden relative">
                 <div className="flex flex-col md:flex-row items-end gap-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 w-full">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-text-dim uppercase flex items-center gap-1"><Hash size={12}/> Start Address</label>
                         <Input type="number" value={opAddress} onChange={e => setOpAddress(Number(e.target.value))} className="h-12 bg-bg-elevated font-black text-2xl border-none" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-text-dim uppercase">Count / Quantity</label>
                         <Input type="number" value={opCount} onChange={e => setOpCount(Number(e.target.value))} className="h-12 bg-bg-elevated font-black text-2xl border-none" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-text-dim uppercase">Values (Write only)</label>
                         <Input value={opValue} onChange={e => setOpValue(e.target.value)} placeholder="0 or CSV" className="h-12 bg-bg-elevated font-mono border-none" />
                       </div>
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={executeOperation} disabled={mode === 'hardware' && !isConnected} className="h-14 px-12 bg-accent text-bg font-black uppercase text-xs rounded-2xl shadow-accent/20 shadow-xl">Execute</Button>
                      <Button onClick={() => { if(isPolling){ if(pollIntervalRef.current) clearInterval(pollIntervalRef.current); setIsPolling(false); } else { setIsPolling(true); pollIntervalRef.current = setInterval(executeOperation, 2000); }}} variant={isPolling ? 'danger' : 'ghost'} disabled={mode === 'hardware' && !isConnected} className={`h-14 w-14 rounded-2xl border-2 ${isPolling ? 'animate-pulse' : ''}`}>{isPolling ? <Square fill="currentColor"/> : <RefreshCw/>}</Button>
                    </div>
                 </div>
              </Card>

              {/* RESULTS TABLE */}
              <Card className="border-border shadow-22 overflow-hidden bg-bg-surface">
                <div className="p-6 bg-bg-elevated/40 border-b border-border flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase flex items-center gap-2"><Binary size={16} className="text-accent"/> Memory Explorer</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead><tr className="bg-bg-elevated/20 text-[10px] font-black uppercase text-text-dim"><th className="px-6 py-4">Addr</th><th className="px-6 py-4">Value</th><th className="px-6 py-4">Hex</th><th className="px-6 py-4">Binary (16-bit)</th></tr></thead>
                    <tbody className="divide-y divide-border/50 font-mono text-sm uppercase">
                      {results.map(r => (
                        <tr key={r.address} className="hover:bg-accent/5">
                          <td className="px-6 py-4 font-bold text-text-dim">{r.address.toString().padStart(5, '0')}</td>
                          <td className="px-6 py-4 font-black">{r.value}</td>
                          <td className="px-6 py-4 text-accent">{r.hex}</td>
                          <td className="px-6 py-4 text-[10px] tracking-widest opacity-60">{r.binary}</td>
                        </tr>
                      ))}
                      {results.length === 0 && <tr><td colSpan={4} className="py-20 text-center opacity-20 italic">No data scanned yet</td></tr>}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right duration-500">
              {/* SLAVE VIEW */}
              <Card className="p-8 border-border bg-accent/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Database size={200}/></div>
                <div className="relative z-10">
                   <Badge variant="accent" className="mb-2">Server Active</Badge>
                   <h2 className="text-3xl font-black italic uppercase tracking-tighter">Slave Data <span className="text-accent underline decoration-accent/20">Monitor</span></h2>
                   <p className="text-text-dim text-sm max-w-xl mt-2 font-medium">Monitoring 64 addresses in real-time. Connect your master to this node to see activity.</p>
                </div>
              </Card>

              {slaveData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderBitGrid('Digital Coils (0x)', slaveData.coils, 0, 'bg-amber-500')}
                  {renderBitGrid('Discrete Inputs (1x)', slaveData.discrete_inputs, 0, 'bg-emerald-500')}
                  {renderRegisterGrid('Holding Registers (4x)', slaveData.holding_registers, 0, 'text-amber-500')}
                  {renderRegisterGrid('Input Registers (3x)', slaveData.input_registers, 0, 'text-emerald-500')}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 bg-bg-elevated/50 rounded-[3rem] border border-dashed border-border/50">
                  <div className="w-16 h-16 bg-bg-surface rounded-full flex items-center justify-center shadow-lg border border-border mb-6 animate-bounce">
                    <Wifi size={24} className="text-accent" />
                  </div>
                  <h3 className="text-lg font-black uppercase">Offline Data Store</h3>
                  <p className="text-text-dim text-sm mt-1">Start bridge in SLAVE mode to monitor datastore.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
