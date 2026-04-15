import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-mono font-medium text-text-muted ml-1 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-accent transition-colors">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full rounded-xl bg-bg-elevated border border-border px-4 py-2.5 
              ${leftIcon ? 'pl-11' : ''}
              text-text-primary text-sm font-sans placeholder:text-text-dim
              focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30
              transition-all duration-200
              ${error ? 'border-danger/50 focus:border-danger focus:ring-danger/20' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-[11px] text-danger font-sans ml-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
