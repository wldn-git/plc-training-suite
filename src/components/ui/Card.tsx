import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', elevated = false, hoverable = false, onClick }) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.5)' } : {}}
      onClick={onClick}
      className={`
        ${elevated ? 'bg-bg-elevated' : 'bg-bg-surface'}
        rounded-xl border border-border shadow-card overflow-hidden
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-border flex items-center justify-between ${className}`}>
    {children}
  </div>
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`px-6 py-5 ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-border bg-black/10 ${className}`}>
    {children}
  </div>
);
