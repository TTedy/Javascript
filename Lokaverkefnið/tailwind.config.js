/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'text': 'rgb(5, 25, 46)',
        'background': 'rgb(237, 245, 253)',
        'primary': 'rgb(239, 181, 123)',
        'secondary': 'rgb(252, 252, 232)',
        'accent': 'rgb(231, 50, 50)',
       },       
    },      
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
  ],
}
