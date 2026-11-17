/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/lib/esm/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        emerald: {
          850: '#0a4b37',
          900: '#064e3b',
          950: '#022c22',
        },
        calendly: {
          green: '#0a4b37',
          lightGreen: '#e8f6ef',
          hoverGreen: '#073d2c',
          textMuted: '#6b7280',
          border: '#e5e7eb',
        }
      },
    },
  },
  plugins: [],
}
