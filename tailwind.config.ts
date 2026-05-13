import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#C0001D',
          navy: '#1A1A2E',
          warm: '#FAFAF8',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        discount: '#16A34A',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        shimmer: 'shimmer 1.5s infinite',
        'slide-in-right': 'slideInRight 0.28s cubic-bezier(0.16,1,0.3,1)',
        'slide-out-right': 'slideOutRight 0.2s ease-in forwards',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          'from': { backgroundPosition: '-200% 0' },
          'to': { backgroundPosition: '200% 0' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(110%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%':   { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(110%)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
