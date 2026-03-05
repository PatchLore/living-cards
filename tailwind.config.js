/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Easter theme: spring green primary, soft pink & pastel accents
        easter: {
          primary: "#7BC67E",   // spring green
          "primary-hover": "#6AB86D",
          pink: "#F9A8D4",     // soft pink
          yellow: "#FDE68A",   // egg yellow
          lavender: "#C4B5FD",
        },
      },
    },
  },
  plugins: [],
};


