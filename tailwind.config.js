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
        navy: '#2B124C',
        'dark-purple': '#4C1D95',
        'vivid-lavender': '#A855F7',
        'light-gray': '#F2F2F2',
        'pure-white': '#FFFFFF',
        'vivid-green': '#22C55E',
        'accent-red': '#e63946',
        'accent-purple': '#A855F7',
        'text-primary': '#222222',
        'text-secondary': '#6B7280',
        border: '#E5E7EB',
        success: '#22C55E',
        warning: '#ffc107',
        error: '#dc3545',
        info: '#17a2b8',
        surface: '#FFFFFF',
        'surface-dark': '#1F1035',
        'surface-border': '#E5E7EB',
        'accent-light': 'rgba(168, 85, 247, 0.12)',
        brand: {
          950: '#140A23',
          900: '#1D1036',
          800: '#2F164F',
          700: '#4C1D95',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          soft: '#FAFAFA',
          muted: '#F2F2F2',
        },
        ink: {
          primary: '#222222',
          secondary: '#6B7280',
          tertiary: '#9CA3AF',
        },
        border: {
          DEFAULT: '#E5E7EB',
          strong: '#D1D5DB',
        },
        accent: {
          DEFAULT: '#A855F7',
          light: '#F3E8FF',
          dark: '#7C3AED',
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
