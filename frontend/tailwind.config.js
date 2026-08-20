/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        govNavy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          500: '#334E68',
          800: '#102A43',
          900: '#0B1B2B',
        },
        civicBlue: {
          500: '#1E3A8A',
          600: '#1E40AF',
          700: '#1D4ED8',
        },
        alertAmber: {
          500: '#D97706',
          600: '#B45309',
        },
      },
    },
  },
  plugins: [],
}
