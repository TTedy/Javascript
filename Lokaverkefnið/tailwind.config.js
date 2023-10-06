/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'text': '#060902',
        'background': '#f1f4f2',
        'primary': '#BBF7D0',
        'secondary': '#AEEAC2',
        'accent': '#0E83BE',
       },       
    },      
  },
  plugins: [
  ],
}
