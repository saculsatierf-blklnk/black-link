/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css,html}",
  ],
  theme: {
    extend: {
      colors: {
        'azul-naval': '#1B3A57',
        'branco-off': '#F4F4F4',
        'dourado-queimado': '#D4AF37',
        'gray-100': '#f7fafc',
        'gray-700': '#4a5568',
        'gray-800': '#2d3748',
      },
      fontFamily: {
        'display': ['Lora', 'serif'],
        'body': ['Nunito Sans', 'sans-serif'],
      },
      backgroundImage: {
        'hero-viagem': "url('/images/hero-florianopolis.jpeg')",
      }
    },
  },
  plugins: [],
}