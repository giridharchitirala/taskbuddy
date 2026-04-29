/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        emerald: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669'
        },
        violet: {
          50: '#f5f3ff',
          500: '#8b5cf6',
          600: '#7c3aed'
        },
        orange: {
          50: '#fff7ed',
          500: '#f97316',
          600: '#ea580c'
        },
        gradient: {
          start: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          warn: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s infinite',
        'bounce-subtle': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'gradient-glow': '0 0 25px rgba(139, 92, 246, 0.4)'
      }
    },
  },
  plugins: [],
}

