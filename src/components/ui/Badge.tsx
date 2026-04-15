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
    accent: 'bg-accent/10 text-accent border-border-accent shadow-accent',
    success: 'bg-success/10 text-success border-success/30',
    warning: 'bg-warning/10 text-warning border-warning/30',
    danger: 'bg-danger/10 text-danger border-danger/30',
  };

  const dots = {
    default: 'bg-text-dim',
    accent: 'bg-accent shadow-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
      font-mono text-[10px] font-bold uppercase tracking-widest border
      ${styles[variant]} 
      ${className}
    `}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dots[variant]}`} />}
      {children}
    </span>
  );
};
