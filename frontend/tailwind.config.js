/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          950: '#070A14',
          900: '#0B0F1C',
          850: '#0F1424',
          800: '#141A2E',
          700: '#1C2440',
          600: '#2A3556',
          500: '#3A4A78',
        },
        brand: {
          50: '#EEF6FF',
          100: '#D9EBFF',
          200: '#B6D8FF',
          300: '#85BDFF',
          400: '#4E9BFF',
          500: '#1E78FF',
          600: '#0B62F0',
          700: '#0A4DC0',
          800: '#0B3F94',
          900: '#0C3675',
        },
        accent: {
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
        success: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        danger: {
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.04), 0 8px 24px -12px rgba(16,24,40,.12)',
        glow: '0 0 0 1px rgba(30,120,255,.18), 0 10px 40px -10px rgba(30,120,255,.35)',
        'glow-success': '0 0 0 1px rgba(16,185,129,.18), 0 10px 40px -10px rgba(16,185,129,.35)',
      },
      backgroundImage: {
        'grid-light': "radial-gradient(circle at 1px 1px, rgba(15,23,42,0.06) 1px, transparent 0)",
        'grid-dark': "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      animation: {
        'fade-in': 'fadeIn .5s ease both',
        'slide-up': 'slideUp .5s cubic-bezier(.16,1,.3,1) both',
        shimmer: 'shimmer 1.6s linear infinite',
        'pulse-ring': 'pulseRing 2s cubic-bezier(.4,0,.6,1) infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-700px 0' }, '100%': { backgroundPosition: '700px 0' } },
        pulseRing: { '0%,100%': { boxShadow: '0 0 0 0 rgba(30,120,255,.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(30,120,255,0)' } },
      },
    },
  },
  plugins: [],
};
