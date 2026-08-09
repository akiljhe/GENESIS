/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#090514',
        darkCard: '#130d24',
        darkBorder: '#291e45',
        brandPurple: '#7c3aed',
        brandBlue: '#0ea5e9'
      }
    },
  },
  plugins: [],
}