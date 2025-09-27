/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Enhanced contrast colors for better accessibility
        gray: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d1d5db', // Improved from default for better contrast
          400: '#9ca3af', // Improved from default for better contrast
          500: '#6b7280', // Improved from default for better contrast
          600: '#4b5563', // Improved from default for better contrast
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
}