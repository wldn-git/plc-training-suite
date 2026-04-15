import { useSimulatorStore } from '@/store/simulatorStore';
import { Card, Badge } from '@/components/ui';
import { LEDIndicator } from './LEDIndicator';
import { ToggleRight } from 'lucide-react';

export const IOPanel: React.FC = () => {
  const { ioPoints, toggleIO } = useSimulatorStore();

  const inputs = ioPoints.filter(p => p.type === 'DI' || p.type === 'AI');
  const outputs = ioPoints.filter(p => p.type === 'DO' || p.type === 'AO');

  return (
    <Card className="flex flex-col h-full bg-bg-surface border-border">
      <div className="p-4 border-b border-border bg-black/20">
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary flex items-center gap-2">
          <ToggleRight size={14} className="text-accent" /> I/O Monitor
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {/* INPUTS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-text-dim uppercase tracking-tighter">Inputs (DI)</span>
            <Badge variant="default" className="text-[9px]">X / I</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {inputs.map(io => (
              <button
                key={io.address}
                onClick={() => toggleIO(io.address)}
                className={`
                  flex items-center justify-between p-2 rounded-lg border transition-all
                  ${io.value ? 'bg-accent/5 border-accent/20' : 'bg-bg-elevated/50 border-border'}
                  hover:border-accent group
                `}
              >
                <span className="font-mono text-[10px] font-bold text-text-primary">{io.address}</span>
                <LEDIndicator status={Boolean(io.value)} size="sm" />
              </button>
            ))}
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-text-dim uppercase tracking-tighter">Outputs (DO)</span>
            <Badge variant="accent" className="text-[9px]">Y / Q</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-left">
            {outputs.map(io => (
              <div
                key={io.address}
                className={`
                  flex items-center justify-between p-2 rounded-lg border
                  ${io.value ? 'bg-success/5 border-success/20' : 'bg-bg-elevated/50 border-border'}
                `}
              >
                <span className="font-mono text-[10px] font-bold text-text-primary">{io.address}</span>
                <LEDIndicator status={Boolean(io.value)} color="blue" size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 bg-black/40 border-t border-border">
        <p className="text-[9px] text-text-dim italic">
          * Klik Input untuk simulasi sinyal (Force ON/OFF).
        </p>
      </div>
    </Card>
  );
};
