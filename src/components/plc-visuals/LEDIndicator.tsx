import React from 'react';
import { motion } from 'framer-motion';

interface LEDProps {
  status: boolean;
  color?: 'green' | 'red' | 'yellow' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const LEDIndicator: React.FC<LEDProps> = ({ status, color = 'green', size = 'md', label }) => {
  const colors = {
    green: 'bg-success shadow-[0_0_12px_rgba(34,197,94,0.8)] border-success/50',
    red: 'bg-danger shadow-[0_0_12px_rgba(239,68,68,0.8)] border-danger/50',
    yellow: 'bg-warning shadow-[0_0_12px_rgba(245,158,11,0.8)] border-warning/50',
    blue: 'bg-accent shadow-[0_0_12px_rgba(0,212,255,0.8)] border-accent/50',
  };

  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-5 h-5',
  };

  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={status ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className={`
          ${sizes[size]} rounded-full border-2 transition-all duration-200
          ${status ? colors[color] : 'bg-bg-elevated border-border shadow-none'}
        `}
      />
      {label && <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-tighter">{label}</span>}
    </div>
  );
};
