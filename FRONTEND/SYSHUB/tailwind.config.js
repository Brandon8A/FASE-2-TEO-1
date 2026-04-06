/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#420029",
        secondary: "#3a5f94",
        surface: "#fcf8fb",
        "surface-tint": "#b50079"
      }
    },
  },
  plugins: [],
}

