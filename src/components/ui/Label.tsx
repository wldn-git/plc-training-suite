import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({ children, className = '', ...props }) => {
  return (
    <label
      className={`block text-xs font-mono font-medium text-text-muted ml-1 uppercase tracking-wider ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};
