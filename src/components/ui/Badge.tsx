import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'accent' | 'success' | 'warning' | 'danger' | 'default';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '', dot }) => {
  const styles = {
    default: 'bg-bg-elevated text-text-muted border-border',
    accent: 'bg-[#0078d4]/15 text-[#0078d4] dark:text-[#38bdf8] border-[#0078d4]/40',
    success: 'bg-[#107c41]/15 text-[#107c41] dark:text-[#4ade80] border-[#107c41]/40',
    warning: 'bg-[#ffb900]/15 text-[#ffb900] dark:text-[#facc15] border-[#ffb900]/40',
    danger: 'bg-[#d13438]/15 text-[#d13438] dark:text-[#f87171] border-[#d13438]/40',
  };

  const dots = {
    default: 'bg-text-dim',
    accent: 'bg-[#0078d4]',
    success: 'bg-[#107c41]',
    warning: 'bg-[#ffb900]',
    danger: 'bg-[#d13438]',
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2 py-0.5
      font-mono text-[10px] font-bold uppercase tracking-wider border
      ${styles[variant]} 
      ${className}
    `}>
      {dot && <span className={`w-1.5 h-1.5 ${dots[variant]}`} />}
      {children}
    </span>
  );
};
