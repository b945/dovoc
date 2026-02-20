/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dovoc: {
            green: "#557C55", // Primary Earthy Green
            light: "#A6CF98", // Secondary Light Green
            brown: "#7E6363", // Soft Brown
            beige: "#F2F1EB", // Background Beige
            dark: "#2A363B",  // Text/Dark
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
