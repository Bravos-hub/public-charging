/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        evz: {
          green: "#03cd8c",
          orange: "#f77f00",
        },
      },
    },
  },
  plugins: [],
}

