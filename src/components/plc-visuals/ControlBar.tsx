import React from 'react';
import { useSimulatorStore } from '@/store/simulatorStore';
import { Button, Badge } from '@/components/ui';
import { Play, Square, Pause, StepForward, Save, FolderOpen } from 'lucide-react';

export const ControlBar: React.FC = () => {
  const { mode, setMode } = useSimulatorStore();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-bg-surface border border-border rounded-xl shadow-card">
      {/* CPU Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${mode === 'RUN' ? 'bg-success animate-pulse shadow-accent' : 'bg-danger'} border-2 border-white/10`} />
          <span className="font-mono text-xs font-black uppercase tracking-widest">CPU {mode}</span>
        </div>
        <div className="h-6 w-[1px] bg-border mx-2" />
        <div className="flex gap-1">
          <Badge variant={mode === 'RUN' ? 'accent' : 'default'} className="text-[10px]">SCAN: 100ms</Badge>
          <Badge variant="default" className="text-[10px]">MEM: 12%</Badge>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-xl border border-white/5">
        <Button
          variant={mode === 'RUN' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setMode('RUN')}
          leftIcon={<Play size={14} fill={mode === 'RUN' ? 'currentColor' : 'none'} />}
          className="h-8 min-w-[80px]"
        >
          RUN
        </Button>
        <Button
          variant={mode === 'STOP' ? 'danger' : 'ghost'}
          size="sm"
          onClick={() => setMode('STOP')}
          leftIcon={<Square size={14} fill={mode === 'STOP' ? 'currentColor' : 'none'} />}
          className="h-8 min-w-[80px]"
        >
          STOP
        </Button>
        <Button
          variant={mode === 'PAUSE' ? 'outline' : 'ghost'}
          size="sm"
          onClick={() => setMode('PAUSE')}
          className="h-8 px-2"
        >
          <Pause size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          disabled={mode !== 'PAUSE'}
        >
          <StepForward size={14} />
        </Button>
      </div>

      {/* File Actions */}
      <div className="flex gap-2">
         <Button variant="ghost" size="sm" leftIcon={<FolderOpen size={14} />}>Open</Button>
         <Button variant="outline" size="sm" leftIcon={<Save size={14} />}>Save Project</Button>
      </div>
    </div>
  );
};
