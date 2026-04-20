/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'black-primary': '#0D0D0D',
        'black-secondary': '#171717',
        'black-tertiary': '#222222',
        'orange-primary': '#E8792B',
        'orange-hover': '#F0A060',
        'orange-dark': '#D4691F',
        'gray-100': '#F5F5F5',
        'gray-300': '#D4D4D4',
        'gray-500': '#736B63',
        'gray-700': '#404040',
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
