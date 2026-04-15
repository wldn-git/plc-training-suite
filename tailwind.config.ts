import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // PLC Training Suite Design Tokens
        bg: {
          DEFAULT: '#0F1117',
          surface: '#1A1D2E',
          elevated: '#222638',
        },
        accent: {
          DEFAULT: '#00D4FF',
          dim: '#00A8CC',
          glow: 'rgba(0, 212, 255, 0.15)',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        text: {
          primary: '#E2E8F0',
          muted: '#94A3B8',
          dim: '#64748B',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          accent: 'rgba(0, 212, 255, 0.3)',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.4)',
        accent: '0 0 20px rgba(0, 212, 255, 0.2)',
        glow: '0 0 40px rgba(0, 212, 255, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
