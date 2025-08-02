/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ Important
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A5F38",
        accent: "#F3F6F4",
        cardBg: "#FFFFFF",
        darkText: "#1E1E1E",
        lightText: "#6B7280",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: "0 2px 10px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
