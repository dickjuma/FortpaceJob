/* eslint-disable import/no-anonymous-default-export */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
       
        primary: '#4A312F',      // Deep Chocolate Brown
        secondary: '#F7F9FB',    // Clean White / Light Gray

        
        accentPink: '#FBB9C2',   // Creamy Pink Pale
        accentMint: '#B7E2BF',   // Creamy Mint Pale

        
        cta: '#D34079',           // Rich Raspberry
      },
    },
      animation: {
        fadeInUp: 'fadeInUp 1s ease forwards',
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: 0, transform: 'translateY(30px)' },
          'to': { opacity: 1, transform: 'translateY(0)' },
        },
      },
  },
  plugins: [],
}