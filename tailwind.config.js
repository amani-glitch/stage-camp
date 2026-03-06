/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'black-primary': '#0A0A0A',
        'black-secondary': '#141414',
        'black-tertiary': '#1F1F1F',
        'orange-primary': '#F97316',
        'orange-hover': '#FB923C',
        'orange-dark': '#EA580C',
        'gray-100': '#F5F5F5',
        'gray-300': '#D4D4D4',
        'gray-500': '#737373',
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
