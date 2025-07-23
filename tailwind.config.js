/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  cursor:'none',
  
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#222831",
          primary: "#393E46",
          secondary: "#00ADB5",
          accent: "#EEEEEE",
          white: "#FFFFFF",
          black: "#000000"
        },
        light: {
          bg: "#B8CFCE",
          primary: "#C96868",
          secondary: "#7F8CAA",
          accent: "#FFF4EA",
          white: "#FFFFFF",
          black: "#000000"
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
}
