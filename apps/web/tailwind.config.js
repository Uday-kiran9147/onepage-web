/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mirror: {
          50: '#EEEDFE',
          100: '#DDDCFD',
          200: '#C3C1FB',
          300: '#AFA9EC',
          400: '#8078D4',
          500: '#534AB7',
          600: '#3C3489',
          700: '#26215C',
          800: '#1B1740',
          900: '#0F0D24',
          950: '#070614',
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
