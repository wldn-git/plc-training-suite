import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card } from '@/components/ui';
import { MousePointer2, Box, Zap, Timer, Hash } from 'lucide-react';

interface InstructionItemProps {
  type: string;
  icon: React.ReactNode;
}

const InstructionItem: React.FC<InstructionItemProps> = ({ type, icon }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `toolbox-${type}`,
    data: { type, isToolboxItem: true },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex flex-col items-center justify-center p-2 bg-bg-elevated border border-border rounded-lg hover:border-accent hover:bg-accent/5 transition-all cursor-grab active:cursor-grabbing group"
    >
      <div className="text-text-muted group-hover:text-accent mb-1">
        {icon}
      </div>
      <span className="text-[10px] font-mono font-bold uppercase tracking-tighter">{type}</span>
    </div>
  );
};

export const Toolbox: React.FC = () => {
  const tools = [
    { type: 'LD', icon: <Zap size={14} /> },
    { type: 'LDI', icon: <Zap size={14} className="rotate-45" /> },
    { type: 'OUT', icon: <Box size={14} /> },
    { type: 'SET', icon: <Box size={14} className="text-success" /> },
    { type: 'RST', icon: <Box size={14} className="text-danger" /> },
    { type: 'TON', icon: <Timer size={14} /> },
    { type: 'TOF', icon: <Timer size={14} /> },
    { type: 'TP', icon: <Timer size={14} /> },
    { type: 'CTU', icon: <Hash size={14} /> },
  ];

  return (
    <Card className="p-3 bg-bg-surface border-border flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <MousePointer2 size={14} className="text-accent" />
        <span className="text-[10px] font-mono font-black uppercase tracking-widest text-text-muted">Toolbox</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {tools.map((tool) => (
          <InstructionItem key={tool.type} {...tool} />
        ))}
      </div>
    </Card>
  );
};
