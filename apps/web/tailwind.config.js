/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mirror: {
          50: '#F2F0FA',
          100: '#E5E2F5',
          200: '#D2CCE9',
          300: '#BDB3DB',
          400: '#A193CB',
          500: '#6B60A8',
          600: '#554C8C',
          700: '#423B6D',
          800: '#2F2A4E',
          900: '#1E1B31',
          950: '#0F0E18',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
      },
    },
  },
  plugins: [],
};
