/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode using a class (e.g., 'dark' on the html element)
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4f46e5', // Indigo for light mode
          dark: '#818cf8',  // Lighter indigo for dark mode
        },
        secondary: {
          light: '#10b981', // Emerald for light mode
          dark: '#6ee7b7',  // Lighter emerald for dark mode
        },
      },
    },
  },
  plugins: [],
}