import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', icon: 28, text: 'text-xs', sub: 'text-[9px]' },
    md: { box: 'w-8 h-8', icon: 32, text: 'text-sm', sub: 'text-[10px]' },
    lg: { box: 'w-10 h-10', icon: 40, text: 'text-base', sub: 'text-xs' },
    xl: { box: 'w-12 h-12', icon: 48, text: 'text-lg', sub: 'text-xs' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Windows 10 Industrial PLC Vector Icon Tile */}
      <div
        className={`${currentSize.box} shrink-0 bg-gradient-to-br from-[#0078d4] to-[#005a9e] shadow-md border border-[#005a9e] flex items-center justify-center p-1 relative overflow-hidden`}
        title="PLC Training Suite"
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
        >
          {/* Microcontroller CPU Core Outline */}
          <rect
            x="7"
            y="7"
            width="22"
            height="22"
            rx="1"
            fill="#005a9e"
            stroke="#ffffff"
            strokeWidth="1.5"
          />

          {/* I/O Pin Terminals - Top & Bottom */}
          <line x1="11" y1="3" x2="11" y2="7" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="square" />
          <line x1="18" y1="3" x2="18" y2="7" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="square" />
          <line x1="25" y1="3" x2="25" y2="7" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="square" />

          <line x1="11" y1="29" x2="11" y2="33" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="square" />
          <line x1="18" y1="29" x2="18" y2="33" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="square" />
          <line x1="25" y1="29" x2="25" y2="33" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="square" />

          {/* Internal Ladder Logic Diagram Contact Symbols */}
          {/* Left Line */}
          <line x1="11" y1="18" x2="14" y2="18" stroke="#ffffff" strokeWidth="1.5" />
          {/* NO Contact (Parallel Bars) */}
          <line x1="14" y1="13" x2="14" y2="23" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="17" y1="13" x2="17" y2="23" stroke="#ffffff" strokeWidth="1.5" />
          {/* Middle Line */}
          <line x1="17" y1="18" x2="20" y2="18" stroke="#ffffff" strokeWidth="1.5" />
          {/* Coil Parentheses ( ) */}
          <path
            d="M 21 14 A 5 5 0 0 0 21 22"
            stroke="#ffffff"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M 25 14 A 5 5 0 0 1 25 22"
            stroke="#ffffff"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-sans font-black tracking-tight text-[#1f1f1f] dark:text-white ${currentSize.text}`}>
              PLC
            </span>
            <span className={`font-sans font-light tracking-wide text-[#0078d4] ${currentSize.text}`}>
              SUITE
            </span>
          </div>
          <span className={`font-mono font-semibold tracking-wider text-[#666666] dark:text-[#858585] uppercase mt-0.5 ${currentSize.sub}`}>
            INDUSTRIAL AUTOMATION
          </span>
        </div>
      )}
    </div>
  );
};
