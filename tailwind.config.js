/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    ".//index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#fd366e',
        surface: '#ffffff',
        border: '#e8ecf1'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}