/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'surface-container-lowest': '#07100d',
        'surface-container-low': '#141d1a',
        'surface-container': '#18211e',
        'surface-container-high': '#232c28',
        'surface-container-highest': '#2d3733',
        'surface-bright': '#323b37',
        'surface-dim': '#0c1512',
        background: '#0c1512',
        'on-background': '#dbe5df',
        'on-surface': '#dbe5df',
        'on-surface-variant': '#a08e7a',
        primary: '#ffc174',
        'primary-container': '#f59e0b',
        'on-primary-container': '#613b00',
        secondary: '#4edea3',
        'secondary-container': '#00a572',
        tertiary: '#e2cc73',
        'outline-variant': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glass: '0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        dock: '0 15px 35px -5px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
      },
    },
  },
  plugins: [],
};

