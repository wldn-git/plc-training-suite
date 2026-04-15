import React from 'react';
import { motion } from 'framer-motion';

interface LadderElementProps {
  instruction: string;
  operand: string;
  isActive: boolean;
  value?: boolean | number;
}

export const LadderElement: React.FC<LadderElementProps> = ({ 
  instruction, 
  operand, 
  isActive, 
  value 
}) => {
  const getSymbol = () => {
    switch (instruction) {
      case 'LD':
        return (
          <div className="flex items-center justify-between w-full h-full px-1">
            <div className={`w-[2px] h-3/4 ${isActive ? 'bg-accent' : 'bg-text-dim'}`} />
            <div className={`w-[2px] h-3/4 ${isActive ? 'bg-accent' : 'bg-text-dim'}`} />
          </div>
        );
      case 'LDI':
        return (
          <div className="relative flex items-center justify-between w-full h-full px-1">
            <div className={`w-[2px] h-3/4 ${isActive ? 'bg-accent' : 'bg-text-dim'}`} />
            <div className={`absolute w-full h-[2px] bg-danger rotate-[60deg] top-1/2 left-0 -translate-y-1/2 opacity-80`} />
            <div className={`w-[2px] h-3/4 ${isActive ? 'bg-accent' : 'bg-text-dim'}`} />
          </div>
        );
      case 'OUT':
      case 'SET':
      case 'RST':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
             <div className={`w-8 h-8 rounded-full border-2 ${isActive ? 'border-accent bg-accent/10' : 'border-text-dim'} flex items-center justify-center`}>
                {instruction !== 'OUT' && (
                  <span className="text-[10px] font-bold">{instruction[0]}</span>
                )}
             </div>
          </div>
        );
      default:
        return (
          <div className={`w-full h-full border-2 rounded ${isActive ? 'border-accent bg-accent/5' : 'border-border'} flex flex-col items-center justify-center px-1`}>
            <span className="text-[8px] font-bold uppercase leading-none mb-1 opacity-60">{instruction}</span>
            {value !== undefined && <span className="text-[8px] font-mono font-bold leading-none">{value}</span>}
          </div>
        );
    }
  };

  return (
    <div className="relative flex flex-col items-center min-w-[60px] cursor-pointer group">
      {/* Operand Address */}
      <div className="absolute -top-5 text-[10px] font-mono font-black text-text-muted group-hover:text-accent transition-colors">
        {operand}
      </div>

      {/* Visual Symbol */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-10 flex items-center justify-center z-10"
      >
        {getSymbol()}
      </motion.div>

      {/* Status Glow */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-accent/20 blur-lg rounded-full"
        />
      )}
    </div>
  );
};
