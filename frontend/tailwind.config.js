/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        period: '#ef4444',
        fertile: '#f59e0b',
        safe: '#22c55e',
      }
    },
  },
  plugins: [],
}
