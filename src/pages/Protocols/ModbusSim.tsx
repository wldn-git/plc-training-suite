import { useState, useEffect } from 'react';
import { Card, Button, Badge, Input, Label } from '@/components/ui';
import { 
  Database, Server, Cpu, Activity, 
  ArrowRightLeft, Box 
} from 'lucide-react';
import mqtt from 'mqtt';

interface Register {
  address: number;
  value: number;
  label: string;
}

export function ModbusSim() {
  const [role, setRole] = useState<'master' | 'slave'>('slave');
  const [slaveId, setSlaveId] = useState(1);
  const [targetSlaveId, setTargetSlaveId] = useState(1);
  
  // Virtual Registers for Slave
  const [coils, setCoils] = useState<Register[]>([
    { address: 0, value: 0, label: 'Motor Start' },
    { address: 1, value: 0, label: 'Valve Open' },
    { address: 2, value: 0, label: 'Warning Light' },
  ]);
  
  const [holdingRegisters, setHoldingRegisters] = useState<Register[]>([
    { address: 0, value: 0, label: 'VFD Speed (Hz)' },
    { address: 1, value: 25, label: 'Temperature (°C)' },
    { address: 2, value: 0, label: 'Tank Level (%)' },
  ]);

  const [traffic, setTraffic] = useState<{ id: string; msg: string; type: 'req' | 'res' }[]>([]);

  // MQTT Logic for Virtual Networking
  useEffect(() => {
    const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
      clientId: `modbus_sim_${Math.random().toString(16).slice(2, 8)}`,
    });

    client.on('connect', () => {
      client.subscribe('plts/training/modbus/#');
    });

    client.on('message', (topic, message) => {
      const data = JSON.parse(message.toString());
      
      // LOG TRAFFIC
      const isReq = topic === 'plts/training/modbus/request';
      setTraffic(prev => [{ 
        id: Math.random().toString(36).substr(2, 5), 
        msg: `${isReq ? 'REQ' : 'RES'} -> ID:${data.id} FC:${data.fc}`, 
        type: (isReq ? 'req' : 'res') as 'req' | 'res' 
      }, ...prev].slice(0, 5));

      // SLAVE LOGIC: Listen for requests
      if (role === 'slave' && topic === 'plts/training/modbus/request' && data.id === slaveId) {
        // Simple response simulation
        setTimeout(() => {
          client.publish('plts/training/modbus/response', JSON.stringify({
            id: slaveId,
            fc: data.fc,
            data: data.fc === 3 ? holdingRegisters.map(r => r.value) : coils.map(c => c.value),
            success: true
          }));
        }, 300);
      }
    });

    return () => { client.end(); };
  }, [role, slaveId, coils, holdingRegisters]);

  const updateRegister = (type: 'coil' | 'holding', address: number, val: number) => {
    if (type === 'coil') {
      setCoils(prev => prev.map(r => r.address === address ? { ...r, value: val } : r));
    } else {
      setHoldingRegisters(prev => prev.map(r => r.address === address ? { ...r, value: val } : r));
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Selector */}
      <Card className="p-4 bg-accent/5 border-accent/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`
              p-3 rounded-xl transition-all
              ${role === 'master' ? 'bg-amber-500 text-bg' : 'bg-emerald-500 text-bg'}
            `}>
              {role === 'master' ? <Server size={24} /> : <Cpu size={24} />}
            </div>
            <div>
              <p className="text-xs font-mono font-black uppercase text-accent">Operation Mode</p>
              <h2 className="text-xl font-black text-text-primary uppercase italic">
                {role === 'master' ? 'Modbus TCP Master' : 'Modbus TCP Slave'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant={role === 'master' ? 'primary' : 'outline'}
              onClick={() => setRole('master')}
            >
              Master Mode
            </Button>
            <Button 
              size="sm" 
              variant={role === 'slave' ? 'primary' : 'outline'}
              onClick={() => setRole('slave')}
            >
              Slave Mode
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Register Map (Slave View) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden border-border/40">
             <div className="bg-bg-elevated p-4 border-b border-border flex items-center justify-between">
                <h3 className="text-xs font-mono font-black uppercase tracking-widest flex items-center gap-2">
                  <Database size={16} className="text-accent" /> Register Data Table
                </h3>
                {role === 'slave' && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-text-dim uppercase">Station ID:</span>
                    <Input 
                      type="number" 
                      value={slaveId} 
                      onChange={e => setSlaveId(Number(e.target.value))}
                      className="w-16 h-8 text-xs text-center"
                    />
                  </div>
                )}
             </div>
             
             <div className="p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Coils */}
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <h4 className="text-[10px] font-black uppercase text-text-dim tracking-widest">Coils (00001 - 00003)</h4>
                     <Badge variant="success">Read/Write</Badge>
                   </div>
                   <div className="space-y-2">
                     {coils.map(coil => (
                       <div key={coil.address} className="flex items-center justify-between p-3 bg-bg-elevated border border-border rounded-xl">
                         <div className="flex items-center gap-3">
                           <span className="text-[10px] font-mono text-text-dim">0000{coil.address + 1}</span>
                           <span className="text-xs font-bold text-text-primary">{coil.label}</span>
                         </div>
                         <div 
                           onClick={() => role === 'slave' && updateRegister('coil', coil.address, coil.value === 1 ? 0 : 1)}
                           className={`
                             w-12 h-6 rounded-full p-1 cursor-pointer transition-all
                             ${coil.value === 1 ? 'bg-accent' : 'bg-bg-surface'}
                           `}
                         >
                           <div className={`w-4 h-4 rounded-full bg-white transition-all ${coil.value === 1 ? 'translate-x-6' : 'translate-x-0'}`} />
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Holding Registers */}
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black uppercase text-text-dim tracking-widest">Registers (40001 - 40003)</h4>
                      <Badge variant="accent">Read/Write</Badge>
                   </div>
                   <div className="space-y-2">
                     {holdingRegisters.map(reg => (
                       <div key={reg.address} className="flex items-center justify-between p-3 bg-bg-elevated border border-border rounded-xl">
                         <div className="flex items-center gap-3">
                           <span className="text-[10px] font-mono text-text-dim">4000{reg.address + 1}</span>
                           <span className="text-xs font-bold text-text-primary">{reg.label}</span>
                         </div>
                         <Input 
                            type="number" 
                            disabled={role !== 'slave'}
                            value={reg.value} 
                            onChange={e => updateRegister('holding', reg.address, Number(e.target.value))}
                            className="w-16 h-8 text-xs text-center border-none shadow-none bg-transparent font-mono font-bold"
                         />
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
          </Card>
        </div>

        {/* Traffic Monitor */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 h-full border-border/40 bg-black/5">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-mono font-black uppercase text-text-dim flex items-center gap-2">
                  <Activity size={16} className="text-accent" /> Traffic Net
                </h3>
                <span className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
             </div>

             <div className="space-y-3">
               {traffic.map(t => (
                 <div key={t.id} className="flex items-center gap-3 p-2 bg-white/5 rounded border border-white/5 animate-slide-up">
                   <div className={`p-1.5 rounded ${t.type === 'req' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                     <ArrowRightLeft size={12} />
                   </div>
                   <span className="text-[10px] font-mono text-text-primary whitespace-nowrap">{t.msg}</span>
                 </div>
               ))}
               
               {traffic.length === 0 && (
                 <div className="py-20 text-center opacity-20">
                   <Box size={32} className="mx-auto mb-2" />
                   <p className="text-[10px] font-mono italic">Awaiting Request...</p>
                 </div>
               )}
             </div>

             <div className="mt-8 pt-8 border-t border-border/20">
                <p className="text-[9px] text-text-dim leading-relaxed italic">
                   Info: Simulasi ini menggunakan shared MQTT network. Jika ada peserta lain menggunakan ID stasiun yang sama, 
                   request akan terdistribusi di antara browser.
                </p>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
