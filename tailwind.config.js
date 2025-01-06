/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  important: true,

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        archivo: ["Archivo", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {},
    },
  },
  plugins: [require("tailwindcss-animated")],
};
