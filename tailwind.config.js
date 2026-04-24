/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',          // ← class strategy
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fffdf0',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#D4AF37',
          600: '#b8972e',
          700: '#9a7d25',
          800: '#7c631c',
          900: '#5e4a13',
        },
        islamic: {
          dark:         '#0a1628',
          darker:       '#060e1a',
          green:        '#1a4731',
          'green-light':'#2d7a56',
          gold:         '#D4AF37',
          'gold-light': '#f0d060',
          surface:      '#0f2035',
          card:         '#132840',
          border:       '#1e3a5a',
        },
      },
      fontFamily: {
        arabic:  ['Amiri',  'serif'],
        cairo:   ['Cairo',  'sans-serif'],
        display: ['Cinzel', 'serif'],
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 3s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
        'spin-slow':  'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-18px)' },
        },
        pulseGold: {
          '0%,100%': { opacity: 1 },
          '50%':     { opacity: 0.75 },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
