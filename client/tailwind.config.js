/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  mode: 'jit',
  purge: [
    './src/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx}',
    './public/index.html',
  ],
  darkMode: false,
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}

