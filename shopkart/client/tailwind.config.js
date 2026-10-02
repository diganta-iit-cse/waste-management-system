/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shopkart: {
          blue: '#1877F2',
          darkBlue: '#0D47A1',
          navy: '#0F172A',
          yellow: '#FF9900',
          amber: '#F59E0B',
          orange: '#FF5722',
          lightBg: '#F1F3F6',
          green: '#388E3C',
          saleRed: '#D32F2F',
        }
      }
    },
  },
  plugins: [],
}
