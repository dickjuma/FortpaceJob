/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: '#222222',
        'dark-purple': '#1d8d38',
        'vivid-lavender': '#2bb75c',
        'light-gray': '#f2f2f2',
        'pure-white': '#ffffff',
        'vivid-green': '#2bb75c',
        'accent-red': '#e63946',
        'accent-purple': '#2bb75c',
        'text-primary': '#222222',
        'text-secondary': '#5e6d55',
        border: '#e0e0e0',
        success: '#2bb75c',
        warning: '#ffc107',
        error: '#dc3545',
        info: '#17a2b8',
        surface: '#f7f7f7',
        'surface-dark': '#222222',
        'surface-border': '#e0e0e0',
        'accent-light': 'rgba(20, 168, 0, 0.12)',
        brand: {
          950: '#0A0F1E',
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          soft: '#FAFAF8',
          muted: '#F4F4F1',
        },
        ink: {
          primary: '#111110',
          secondary: '#57534E',
          tertiary: '#A8A29E',
        },
        border: {
          DEFAULT: '#E7E5E4',
          strong: '#D6D3D1',
        },
        accent: {
          DEFAULT: '#16A34A',
          light: '#DCFCE7',
          dark: '#15803D',
        },
        warn: {
          DEFAULT: '#D97706',
          light: '#FEF3C7',
        },
        danger: {
          DEFAULT: '#DC2626',
          light: '#FEE2E2',
        },
        info: {
          DEFAULT: '#2563EB',
          light: '#DBEAFE',
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        display: ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-in-out forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
