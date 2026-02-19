/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dnd: {
          bg: '#0f0f1a',
          surface: '#1a1a2e',
          card: '#16213e',
          border: '#2a2a4a',
          gold: '#c9a84c',
          'gold-light': '#e8c96d',
          red: '#e53e3e',
          'red-dark': '#9b1c1c',
          green: '#38a169',
          blue: '#3182ce',
          purple: '#805ad5',
          orange: '#dd6b20',
          text: '#e2e8f0',
          muted: '#718096',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
      }
    },
  },
  plugins: [],
}
