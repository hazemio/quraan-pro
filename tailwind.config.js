/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffdf0',
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
        emerald: {
          950: '#022c22',
        },
        islamic: {
          dark: '#0a1628',
          darker: '#060e1a',
          green: '#1a4731',
          'green-light': '#2d7a56',
          gold: '#D4AF37',
          'gold-light': '#f0d060',
          surface: '#0f2035',
          card: '#132840',
          border: '#1e3a5a',
        }
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        cairo: ['Cairo', 'sans-serif'],
        display: ['Cinzel', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out 2s infinite',
        'pulse-gold': 'pulseGold 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 0 0 rgba(212,175,55,0.4)' },
          '50%': { opacity: 0.8, boxShadow: '0 0 0 20px rgba(212,175,55,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'geometric': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
