import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, fullWidth, leftIcon, rightIcon, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-[#0078d4] text-white hover:bg-[#0063b1] border-[#005a9e] shadow-sm',
      ghost: 'bg-transparent text-text-muted hover:text-text-primary hover:bg-bg-elevated border-transparent',
      danger: 'bg-[#d13438] text-white hover:bg-[#a80000] border-[#a80000]',
      outline: 'bg-transparent text-text-primary border-border hover:border-[#0078d4] hover:text-[#0078d4] hover:bg-[#0078d4]/10',
    };

    const sizes = {
      sm: 'px-3 py-1 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-2.5 text-base',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={`
          inline-flex items-center justify-center gap-2 font-sans font-semibold 
          border transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none
          ${fullWidth ? 'w-full' : ''}
          ${variants[variant]} 
          ${sizes[size]} 
          ${className}
        `}
        disabled={isLoading || (props.disabled as any)}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
