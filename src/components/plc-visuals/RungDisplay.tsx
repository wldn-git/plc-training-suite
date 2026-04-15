import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Rung } from '@/types/plc.types';
import { useSimulatorStore } from '@/store/simulatorStore';
import { LadderElement } from './LadderElement';

interface RungDisplayProps {
  rung: Rung;
  index: number;
}

export const RungDisplay: React.FC<RungDisplayProps> = ({ rung, index }) => {
  const { activeRungIds, timers, counters } = useSimulatorStore();
  const { isOver, setNodeRef } = useDroppable({
    id: rung.id,
  });

  const isActive = activeRungIds.has(rung.id);

  // Helper untuk mendapatkan status/data tambahan elemen (misal value timer)
  const getElementValue = (operand: string) => {
    if (operand.startsWith('T')) {
      return timers.find(t => t.address === operand)?.accumulated ?? 0;
    }
    if (operand.startsWith('C')) {
      return counters.find(c => c.address === operand)?.count ?? 0;
    }
    return undefined;
  };

  return (
    <div 
      ref={setNodeRef}
      className={`
        relative flex flex-col group animate-fade-in pl-12 pr-12 rounded-xl transition-all
        ${isOver ? 'bg-accent/5 ring-2 ring-accent/20 scale-[1.01]' : ''}
      `}
    >
      {/* Rung Metadata */}
      <div className="flex items-center gap-4 mb-2">
        <div className="flex flex-col">
          <span className="font-mono text-[10px] text-text-muted font-bold tracking-tighter">
            RUNG {String(index).padStart(4, '0')}
          </span>
          {rung.comment && <p className="text-[10px] text-accent/40 italic leading-none">{rung.comment}</p>}
        </div>
      </div>

      <div className="flex items-center group/rung h-24">
        {/* Left Bus Bar (Hot) */}
        <div className={`
          absolute left-0 w-2 h-full border-r-2 
          ${isActive ? 'bg-gradient-to-r from-accent/20 to-accent border-accent shadow-[0_0_15px_rgba(0,212,255,0.5)]' : 'bg-bg-elevated/20 border-border/40'}
          transition-all duration-300
        `} />

        {/* Content Area Wire */}
        <div className="flex-1 flex items-center relative h-full">
          {/* Main Horizontal Wire */}
          <div className={`
            absolute left-0 right-0 h-[3px] top-1/2 -translate-y-1/2 
            ${isActive ? 'bg-accent shadow-[0_0_8px_rgba(0,212,255,0.4)]' : 'bg-bg-elevated/40'} 
            z-0 transition-colors duration-300
          `} />

          {/* Rung Elements Container */}
          <div className="flex items-center justify-between w-full h-full px-6 z-10">
             {/* Elements Grid (v1.0 is serial) */}
             <div className="flex items-center gap-12">
                {rung.elements.map((el) => (
                  <LadderElement 
                    key={el.id}
                    instruction={el.instruction}
                    operand={el.operand}
                    isActive={isActive} // v1.0 serial simplified: if rung is active, elements are active (tapi bisa ditingkatkan)
                    value={getElementValue(el.operand)}
                  />
                ))}
             </div>
          </div>
        </div>

        {/* Right Bus Bar (Neutral) */}
        <div className={`
           absolute right-0 w-2 h-full border-l-2 border-border/40 bg-bg-elevated/20
        `} />
      </div>

      {/* Rung Bottom Border (Dashed) */}
      <div className="w-full h-px border-b border-dashed border-border/10 mt-4" />
    </div>
  );
};
