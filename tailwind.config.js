/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: '#222222', // Upwork dark slate/charcoal
        'dark-purple': '#118a00', // Upwork hover dark green
        'vivid-lavender': '#14a800', // Upwork primary green
        'light-gray': '#f2f2f2',
        'pure-white': '#ffffff',
        'vivid-green': '#14a800', // Upwork primary green
        'accent-red': '#e63946',
        'accent-purple': '#14a800', // Upwork primary green
        'text-primary': '#222222',
        'text-secondary': '#5e6d55',
        border: '#e0e0e0',
        success: '#14a800', // Upwork primary green
        warning: '#ffc107',
        error: '#dc3545',
        info: '#17a2b8',
        surface: '#f7f7f7',
        'surface-dark': '#222222',
        'surface-border': '#e0e0e0',
        'accent-light': 'rgba(20, 168, 0, 0.12)',
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        display: ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-in-out forwards',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' }
        }
      }
    }
  },
  plugins: [],
}