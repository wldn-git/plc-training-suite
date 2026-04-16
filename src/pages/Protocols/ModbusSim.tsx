import { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge, Input } from '@/components/ui';
import { 
  Server, Cpu, Activity, 
  Box, Globe, Zap, Terminal, Network
} from 'lucide-react';
import mqtt, { MqttClient } from 'mqtt';

interface Register {
  address: number;
  value: number;
  label: string;
}

export function ModbusSim() {
  const [role, setRole] = useState<'master' | 'slave'>('slave');
  const [userIp, setUserIp] = useState(`192.168.1.${Math.floor(Math.random() * 254) + 1}`);
  const [targetIp, setTargetIp] = useState('192.168.1.10');
  const [unitId] = useState(1);
  const clientRef = useRef<MqttClient | null>(null);
  
  // ==========================================
  // REGISTER MAPS (Slave State)
  // ==========================================
  const [coils, setCoils] = useState<Register[]>([
    { address: 0, value: 0, label: 'Motor Start' },
    { address: 1, value: 0, label: 'Valve Open' },
  ]);
  const [discreteInputs, setDiscreteInputs] = useState<Register[]>([
    { address: 0, value: 1, label: 'Emergency Stop' },
    { address: 1, value: 0, label: 'Proximity Sensor' },
  ]);
  const [inputRegisters, setInputRegisters] = useState<Register[]>([
    { address: 0, value: 450, label: 'Flow Meter (L/m)' },
    { address: 1, value: 2048, label: 'Pressure (bar)' },
  ]);
  const [holdingRegisters, setHoldingRegisters] = useState<Register[]>([
    { address: 0, value: 50, label: 'Set Point Hz' },
    { address: 1, value: 100, label: 'PID Gain' },
  ]);

  const [traffic, setTraffic] = useState<{ id: string; msg: string; type: 'req' | 'res' | 'info' }[]>([]);

  // ==========================================
  // NETWORKING LOGIC (MQTT as Virtual Bus)
  // ==========================================
  useEffect(() => {
    const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
      clientId: `modbus_p2p_${Math.random().toString(16).slice(2, 8)}`,
    });
    clientRef.current = client;

    client.on('connect', () => {
      // Listen to own IP messages
      client.subscribe(`plts/modbus/ip/${userIp}/#`);
      setTraffic(prev => [{ id: 'init', msg: `NETWORK ONLINE: IP ${userIp}`, type: 'info' as const }, ...prev]);
    });

    client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // CASE: Slave receiving request from Master
        if (role === 'slave' && topic.endsWith('/req')) {
           if (data.unitId !== unitId && data.unitId !== 255) return;

           setTraffic(prev => [{ 
             id: Math.random().toString(36).substr(2, 5), 
             msg: `INCOMING REQ from ${data.srcIp} [FC:${data.fc}]`, 
             type: 'req' as const
           }, ...prev].slice(0, 10));

           // Simulate Response
           setTimeout(() => {
             let responseData: any = [];
             if (data.fc === 1) responseData = coils.map(c => c.value);
             if (data.fc === 2) responseData = discreteInputs.map(c => c.value);
             if (data.fc === 3) responseData = holdingRegisters.map(c => c.value);
             if (data.fc === 4) responseData = inputRegisters.map(c => c.value);

             client.publish(`plts/modbus/ip/${data.srcIp}/res`, JSON.stringify({
               destIp: data.srcIp,
               srcIp: userIp,
               fc: data.fc,
               unitId,
               data: responseData,
               status: 'OK'
             }));
           }, 200);
        }

        // CASE: Master receiving response from Slave
        if (role === 'master' && topic.endsWith('/res')) {
          setTraffic(prev => [{ 
            id: Math.random().toString(36).substr(2, 5), 
            msg: `REPLY from ${data.srcIp}: [${data.data.join(',')}]`, 
            type: 'res' as const
          }, ...prev].slice(0, 10));
        }

      } catch (e) { console.error('Traffic analysis error', e); }
    });

    return () => { client.end(); };
  }, [role, userIp, unitId, coils, discreteInputs, inputRegisters, holdingRegisters]);

  const sendRequest = (fc: number) => {
    if (!clientRef.current) return;
    setTraffic(prev => [{ 
      id: Math.random().toString(36).substr(2, 5), 
      msg: `SEND REQ to ${targetIp} [FC:${fc}]`, 
      type: 'req' as const
    }, ...prev].slice(0, 10));

    clientRef.current.publish(`plts/modbus/ip/${targetIp}/req`, JSON.stringify({
      destIp: targetIp,
      srcIp: userIp,
      fc,
      unitId: 1, // Default ID target
    }));
  };

  const updateRegister = (type: string, address: number, val: number) => {
    const setterMap: any = {
      'coil': setCoils,
      'di': setDiscreteInputs,
      'ir': setInputRegisters,
      'hr': setHoldingRegisters
    };
    setterMap[type]( (prev: Register[]) => prev.map(r => r.address === address ? { ...r, value: val } : r));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Networking Banner */}
      <Card className="p-5 bg-bg-surface border-accent/20 group relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity">
           <Globe size={180} className="translate-x-1/2 -translate-y-1/4" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`
              w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500
              ${role === 'master' ? 'bg-amber-500 text-bg rotate-12' : 'bg-emerald-500 text-bg -rotate-12'}
            `}>
              {role === 'master' ? <Network size={28} /> : <Cpu size={28} />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={role === 'master' ? 'warning' : 'success'} className="uppercase font-black text-[9px] tracking-widest px-2">
                  MODBUS {role.toUpperCase()}
                </Badge>
                <code className="text-[10px] font-mono font-bold text-accent">TCP/IP STACK ACTIVE</code>
              </div>
              <h2 className="text-2xl font-black text-text-primary uppercase italic tracking-tighter">
                Virtual <span className="text-accent underline decoration-accent/30">Network Interface</span>
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-black/20 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
             <div className="flex items-center gap-2 px-3 border-r border-white/10">
                <span className="text-[10px] font-black uppercase text-text-dim">Local IP:</span>
                <Input 
                   value={userIp} 
                   onChange={e => setUserIp(e.target.value)}
                   className="w-32 h-8 text-[11px] font-mono font-bold bg-transparent border-none text-accent"
                />
             </div>
             <div className="flex gap-1 p-1">
                <Button size="sm" variant={role === 'master' ? 'primary' : 'ghost'} onClick={() => setRole('master')} className="h-8 text-[10px] px-4">MASTER</Button>
                <Button size="sm" variant={role === 'slave' ? 'primary' : 'ghost'} onClick={() => setRole('slave')} className="h-8 text-[10px] px-4">SLAVE</Button>
             </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Register Map (Large Panel) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Digital Section (1x & 0x) */}
             <Card className="p-0 overflow-hidden border-border/40">
                <div className="bg-bg-elevated p-4 border-b border-border flex items-center justify-between">
                   <h3 className="text-[10px] font-mono font-black uppercase tracking-widest flex items-center gap-2">
                     <Zap size={14} className="text-emerald-400" /> Digital Signals (Bin)
                   </h3>
                </div>
                <div className="p-5 space-y-6">
                   {/* Discrete Inputs */}
                   <div className="space-y-3">
                      <div className="flex items-center justify-between opacity-50">
                        <span className="text-[9px] font-bold uppercase tracking-widest">Discrete Inputs (1x)</span>
                        <span className="text-[9px] font-mono">Status: Read Only</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                         {discreteInputs.map(reg => (
                           <div key={reg.address} className="flex items-center justify-between p-3 bg-bg-surface/50 border border-border/30 rounded-xl">
                              <span className="text-[10px] font-mono text-text-dim">1000{reg.address+1}</span>
                              <span className="text-xs font-bold">{reg.label}</span>
                              <div 
                                onClick={() => role === 'slave' && updateRegister('di', reg.address, reg.value ? 0 : 1)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all ${reg.value ? 'bg-emerald-500 text-bg shadow-lg shadow-emerald-500/20' : 'bg-bg-elevated text-text-dim'}`}>
                                <span className="text-xs font-black">{reg.value}</span>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                   {/* Coils */}
                   <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-accent">Coils (0x)</span>
                        <span className="text-[9px] font-mono text-accent">Status: Read/Write</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                         {coils.map(reg => (
                           <div key={reg.address} className="flex items-center justify-between p-3 bg-bg-surface/50 border border-border/30 rounded-xl">
                              <span className="text-[10px] font-mono text-text-dim">0000{reg.address+1}</span>
                              <span className="text-xs font-bold">{reg.label}</span>
                              <div 
                                onClick={() => role === 'slave' && updateRegister('coil', reg.address, reg.value ? 0 : 1)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all ${reg.value ? 'bg-amber-500 text-bg shadow-lg shadow-amber-500/20' : 'bg-bg-elevated text-text-dim'}`}>
                                <span className="text-xs font-black">{reg.value}</span>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </Card>

             {/* Analog Section (3x & 4x) */}
             <Card className="p-0 overflow-hidden border-border/40">
                <div className="bg-bg-elevated p-4 border-b border-border flex items-center justify-between">
                   <h3 className="text-[10px] font-mono font-black uppercase tracking-widest flex items-center gap-2">
                     <Activity size={14} className="text-amber-400" /> Analog Data (Word)
                   </h3>
                </div>
                <div className="p-5 space-y-6">
                   {/* Input Registers */}
                   <div className="space-y-3">
                      <div className="flex items-center justify-between opacity-50">
                        <span className="text-[9px] font-bold uppercase tracking-widest">Input Registers (3x)</span>
                        <span className="text-[10px] font-mono">Status: Read Only</span>
                      </div>
                      <div className="space-y-2">
                        {inputRegisters.map(reg => (
                           <div key={reg.address} className="flex items-center justify-between p-3 bg-bg-surface/50 border border-border/30 rounded-xl">
                              <div className="flex flex-col">
                                <span className="text-[9px] font-mono text-text-dim">3000{reg.address+1}</span>
                                <span className="text-xs font-bold leading-tight">{reg.label}</span>
                              </div>
                              <Input 
                                type="number" 
                                disabled={role !== 'slave'}
                                value={reg.value} 
                                onChange={e => updateRegister('ir', reg.address, Number(e.target.value))}
                                className="w-20 h-8 text-xs text-right font-mono font-black bg-transparent border-none text-emerald-400" 
                              />
                           </div>
                        ))}
                      </div>
                   </div>
                   {/* Holding Registers */}
                   <div className="space-y-3">
                      <div className="flex items-center justify-between text-accent/80">
                        <span className="text-[9px] font-bold uppercase tracking-widest">Holding Registers (4x)</span>
                        <span className="text-[10px] font-mono">Status: Read/Write</span>
                      </div>
                      <div className="space-y-2">
                        {holdingRegisters.map(reg => (
                           <div key={reg.address} className="flex items-center justify-between p-3 bg-bg-surface/50 border border-border/30 rounded-xl">
                              <div className="flex flex-col">
                                <span className="text-[9px] font-mono text-text-dim">4000{reg.address+1}</span>
                                <span className="text-xs font-bold leading-tight">{reg.label}</span>
                              </div>
                              <Input 
                                type="number" 
                                disabled={role !== 'slave'}
                                value={reg.value} 
                                onChange={e => updateRegister('hr', reg.address, Number(e.target.value))}
                                className="w-20 h-8 text-xs text-right font-mono font-black bg-transparent border-none text-amber-500" 
                              />
                           </div>
                        ))}
                      </div>
                   </div>
                </div>
             </Card>
          </div>
        </div>

        {/* Master Control Panel & Log */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="p-6 border-accent/30 bg-accent/5">
              <h3 className="text-xs font-mono font-black uppercase text-accent mb-4 flex items-center gap-2">
                <Server size={14} /> Master Dashboard
              </h3>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-text-dim">Destination IP</label>
                    <Input 
                      value={targetIp} 
                      onChange={e => setTargetIp(e.target.value)}
                      disabled={role === 'slave'}
                      className="h-10 text-xs font-mono font-bold" 
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" disabled={role === 'slave'} onClick={() => sendRequest(1)} className="text-[9px] font-bold py-4">READ COILS</Button>
                    <Button size="sm" variant="outline" disabled={role === 'slave'} onClick={() => sendRequest(2)} className="text-[9px] font-bold py-4">READ DI</Button>
                    <Button size="sm" variant="outline" disabled={role === 'slave'} onClick={() => sendRequest(4)} className="text-[9px] font-bold py-4">READ IR (3x)</Button>
                    <Button size="sm" variant="primary"  disabled={role === 'slave'} onClick={() => sendRequest(3)} className="text-[9px] font-bold py-4">READ HR (4x)</Button>
                 </div>
              </div>
           </Card>

           <Card className="h-[400px] flex flex-col overflow-hidden border-border/40">
              <div className="bg-bg-elevated p-3 border-b border-border flex items-center gap-2">
                 <Terminal size={14} className="text-accent" />
                 <span className="text-[10px] font-mono font-black uppercase tracking-widest">Protocol Sniffer</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono scrollbar-vibrant bg-black/20">
                 {traffic.map(t => (
                   <div key={t.id} className={`text-[10px] flex gap-2 animate-slide-up ${t.type === 'req' ? 'text-amber-400' : t.type === 'res' ? 'text-emerald-400' : 'text-text-dim'}`}>
                      <span className="shrink-0">{t.type === 'req' ? '>>' : t.type === 'res' ? '<<' : '--'}</span>
                      <span className="leading-tight">{t.msg}</span>
                   </div>
                 ))}
                 {traffic.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center opacity-20">
                      <Box size={24} className="mb-2" />
                      <p className="text-[8px] uppercase tracking-widest">No Traffic detected</p>
                   </div>
                 )}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
