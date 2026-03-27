/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Rajdhani'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        army: {
          50: '#f0f4e8',
          100: '#d9e4c2',
          200: '#b8cf8a',
          300: '#8fb34e',
          400: '#6d9a2e',
          500: '#4a7c10',
          600: '#3a620c',
          700: '#2c4c09',
          800: '#1e3606',
          900: '#122004',
        }
      }
    },
  },
  plugins: [],
};
