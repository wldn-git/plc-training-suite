import { useState } from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { 
  Wifi, WifiOff, Settings, 
  Box, Droplets, Layers, Cpu,
  ExternalLink, Info
} from 'lucide-react';
import { useIOBrokerStore } from '@/store/ioBrokerStore';
import { useMQTT } from '@/hooks/useMQTT';
import { motion, AnimatePresence } from 'framer-motion';
import { ConveyorSorting } from './scenarios/ConveyorSorting';

// ============================================================
// Plant Sandbox — Sarana Simulasi I/O & Digital Twin
// ============================================================

export default function PlantSandbox() {
  const { settings } = useIOBrokerStore();
  const { status, publishCommand } = useMQTT();
  const [activeScenario, setActiveScenario] = useState<'conveyor' | 'tank' | 'traffic'>('conveyor');

  return (
    <div className="flex flex-col gap-8 animate-fade-in max-w-7xl mx-auto pb-20">
      {/* Header & Connectivity Control */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-bg-surface p-8 rounded-3xl border border-border shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className={`p-4 rounded-2xl ${status === 'connected' ? 'bg-success/20 text-success' : 'bg-bg-elevated text-text-muted'} transition-colors`}>
            {status === 'connected' ? <Wifi size={32} /> : <WifiOff size={32} />}
          </div>
          <div>
            <h1 className="text-3xl font-mono font-black text-text-primary tracking-tighter uppercase italic">
              Plant <span className="text-accent">Sandbox</span> 
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={status === 'connected' ? 'success' : 'outline' as any}>
                {status.toUpperCase()}
              </Badge>
              <span className="text-[10px] font-mono text-text-dim uppercase tracking-widest">{settings.url}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Button variant="ghost" size="sm" leftIcon={<Settings size={16} />}>Config</Button>
          <Button variant="outline" size="sm" leftIcon={<Info size={16} />}>Help Bridge</Button>
          <div className="h-10 w-[1px] bg-border mx-2" />
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest leading-none mb-1">Active Topic</p>
            <p className="text-sm font-mono font-bold text-text-primary">{settings.baseTopic}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Scenario Selection Sidebar */}
        <aside className="lg:col-span-1 space-y-4">
           <h3 className="font-mono text-xs font-bold text-text-muted uppercase tracking-widest px-2 mb-4">Select Simulation</h3>
           
           <ScenarioNavItem 
             icon={<Box />}
             label="Sorting Conveyor"
             active={activeScenario === 'conveyor'}
             onClick={() => setActiveScenario('conveyor')}
             description="Simulasi pemilahan barang dengan proximity sensor & pneumatic."
           />
           
           <ScenarioNavItem 
             icon={<Droplets />}
             label="Water Tank Level"
             active={activeScenario === 'tank'}
             onClick={() => setActiveScenario('tank')}
             description="Kontrol level cair menggunakan sensor analog & pump control."
           />

           <ScenarioNavItem 
             icon={<Layers />}
             label="Traffic Controller"
             active={activeScenario === 'traffic'}
             onClick={() => setActiveScenario('traffic')}
             description="Logika lampu lalu lintas 4 simpang dengan mode darurat."
           />

           <Card className="p-6 bg-accent/5 border-accent/20 mt-8">
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="text-accent" size={20} />
                <h4 className="text-sm font-bold text-text-primary">I/O Monitor</h4>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-text-dim">Latency</span>
                   <span className="text-success font-mono font-bold">12ms</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-text-dim">Packets</span>
                   <span className="text-text-primary font-mono font-bold">1.2k / min</span>
                 </div>
              </div>
           </Card>
        </aside>

        {/* Main Simulation Area */}
        <main className="lg:col-span-3 min-h-[600px] flex flex-col gap-6">
           <Card className="flex-1 bg-gradient-to-br from-bg-surface to-bg-base border-border overflow-hidden relative shadow-2xl rounded-3xl">
              {/* Scenario Stage */}
              <div className="h-full flex flex-col p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-mono font-black text-text-primary uppercase">
                      {activeScenario === 'conveyor' ? 'Sorting Conveyor v2.0' : 
                       activeScenario === 'tank' ? 'Integrated Water System' : 
                       'Advanced Traffic Control'}
                    </h2>
                    <p className="text-text-muted text-sm max-w-lg mt-2">
                       Mode: {status === 'connected' ? 'External PLC Control' : 'Local Manual Simulation'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" leftIcon={<ExternalLink size={14} />}>Full View</Button>
                  </div>
                </div>

                {/* Virtual Hardware Visualization */}
                <div className="flex-1 rounded-2xl bg-black/40 border border-white/5 relative overflow-hidden flex items-center justify-center">
                   {/* Scenario Stage Selection */}
                   <AnimatePresence mode="wait">
                     {activeScenario === 'conveyor' ? (
                       <motion.div 
                         key="conveyor"
                         className="w-full h-full"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                       >
                         <ConveyorSorting />
                       </motion.div>
                     ) : (
                       <div className="text-text-dim text-sm italic">Scenario module loading...</div>
                     )}
                   </AnimatePresence>
                </div>

                {/* Operator Panel (Inputs for PLC) */}
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <ControlSwitch label="Start System" address="I0.0" onToggle={(v: boolean | number) => publishCommand('I0.0', v)} />
                  <ControlSwitch label="Stop System" address="I0.1" onToggle={(v: boolean | number) => publishCommand('I0.1', v)} />
                  <ControlSwitch label="Manual Mode" address="I0.2" onToggle={(v: boolean | number) => publishCommand('I0.2', v)} />
                  <ControlSwitch label="Emergency Stop" address="I0.3" isDanger onToggle={(v: boolean | number) => publishCommand('I0.3', v)} />
                </div>
              </div>
           </Card>
        </main>
      </div>
    </div>
  );
}

function ScenarioNavItem({ icon, label, description, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full text-left p-5 rounded-2xl border transition-all group
        ${active ? 'bg-accent border-accent text-bg shadow-lg shadow-accent/20' : 'bg-bg-surface border-border text-text-primary hover:border-accent/40'}
      `}
    >
      <div className="flex items-center gap-4 mb-2">
        <div className={`p-2 rounded-lg ${active ? 'bg-bg/20' : 'bg-accent/10 text-accent'}`}>
          {icon}
        </div>
        <span className="font-bold text-sm tracking-tight">{label}</span>
      </div>
      <p className={`text-[10px] leading-tight ${active ? 'text-bg/70' : 'text-text-dim'}`}>
        {description}
      </p>
    </button>
  );
}

function ControlSwitch({ label, address, isDanger = false, onToggle }: any) {
  const [active, setActive] = useState(false);
  
  const handleToggle = () => {
    const newState = !active;
    setActive(newState);
    onToggle(newState);
  };

  return (
    <div 
      onClick={handleToggle}
      className={`
        p-4 rounded-xl border cursor-pointer select-none transition-all flex flex-col gap-2
        ${active ? 'bg-bg-surface border-accent shadow-lg' : 'bg-bg-elevated border-border opacity-60 hover:opacity-100'}
        ${active && isDanger ? 'border-danger shadow-danger/20' : ''}
      `}
    >
      <div className="flex justify-between items-start">
        <span className="text-[9px] font-mono font-bold text-text-dim uppercase">{address}</span>
        <div className={`w-2 h-2 rounded-full ${active ? 'bg-accent animate-pulse shadow-[0_0_5px_rgba(0,212,255,1)]' : 'bg-bg-base border border-border'}`} />
      </div>
      <span className="text-xs font-bold text-text-primary truncate">{label}</span>
    </div>
  );
}
