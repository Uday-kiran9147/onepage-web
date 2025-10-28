import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#EBF5FF', // A light, calming blue
        'brand-dark': '#1F2937', // Dark text
        'brand-light': '#F9FAFB', // Off-white background
        'brand-green': '#10B981', // Success/check color
      },
      fontFamily: {
        // Assumes you're importing a font like Inter in your layout.tsx
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
      }
    },
  },
  plugins: [],
};
export default config;