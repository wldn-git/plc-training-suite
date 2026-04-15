import { useEffect } from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useSimulatorStore } from '@/store/simulatorStore';
import { useSimulator } from '@/hooks/useSimulator';
import { ControlBar } from '@/components/plc-visuals/ControlBar';
import { IOPanel } from '@/components/plc-visuals/IOPanel';
import { Toolbox } from '@/components/plc-visuals/Toolbox';
import { RungDisplay } from '@/components/plc-visuals/RungDisplay';
import { Button, Card } from '@/components/ui';
import { Plus, Play, Database } from 'lucide-react';

export default function SimulatorCanvas() {
  const { rungs, setProject, addElementToRung, addRung } = useSimulatorStore();
  useSimulator();

  // Create Initial Project if empty for testing
  useEffect(() => {
    if (rungs.length === 0) {
      setProject({
        id: 'test-1',
        name: 'Garis Perakitan Dasar',
        createdAt: new Date(),
        updatedAt: new Date(),
        ioPoints: [
          { address: 'X0', label: 'Start PB', type: 'DI', value: false },
          { address: 'X1', label: 'Stop PB', type: 'DI', value: true },
          { address: 'Y0', label: 'Motor Conveyor', type: 'DO', value: false },
          { address: 'T0', label: 'Timer Delay', type: 'DI', value: false },
        ],
        rungs: [
          {
            id: 'rung-1',
            comment: 'Kontrol Motor Sederhana',
            elements: [
              { id: 'el-1', instruction: 'LD', operand: 'X0', position: { row: 0, col: 0 } },
              { id: 'el-2', instruction: 'OUT', operand: 'Y0', position: { row: 0, col: 1 } },
            ],
          },
        ],
      });
    }
  }, [rungs.length, setProject]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    
    if (over && active.data.current?.isToolboxItem) {
      const rungId = over.id as string;
      const instructionType = active.data.current.type;
      addElementToRung(rungId, instructionType);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-full gap-4 animate-fade-in max-w-[1600px] mx-auto w-full">
        {/* Top Header / Control */}
        <ControlBar />

        <div className="flex flex-col lg:flex-row gap-4 flex-1 overflow-hidden">
          {/* Left Side: Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
            <IOPanel />
            <Toolbox />
            
            <Card className="p-4 bg-accent/5 border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Database size={14} className="text-accent" />
                <span className="text-[10px] font-mono font-black uppercase text-accent">Memory Usage</span>
              </div>
              <div className="h-1.5 w-full bg-bg-elevated rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[15%]" />
              </div>
              <p className="text-[9px] text-text-muted mt-2">12 / 256 Rungs used</p>
            </Card>
          </aside>

          {/* Main Side: Ladder Editor Area */}
          <main className="flex-1 bg-bg-surface border border-border rounded-xl flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-border bg-black/10 flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">Ladder Editor</h2>
                <span className="text-[10px] text-text-muted">v1.2 Stable Scan Engine</span>
              </div>
              <div className="flex gap-2">
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={addRung}
                   leftIcon={<Plus size={14} />}
                 >
                   Add Rung
                 </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-12 space-y-16 scrollbar-thin bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
              {rungs.map((rung, i) => (
                <RungDisplay key={rung.id} rung={rung} index={i} />
              ))}

              {rungs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <Play size={48} className="mb-4 text-text-dim" />
                  <p className="font-mono text-sm">No active project logic.</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={addRung}>Create First Rung</Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </DndContext>
  );
}
