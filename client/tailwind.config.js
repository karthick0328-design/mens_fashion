/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5dae2',
          300: '#b0bccb',
          400: '#8497af',
          500: '#637795',
          600: '#4e5f7b',
          700: '#3f4d64',
          800: '#364154',
          900: '#1e2430',
          950: '#0f131a',
        },
        accent: {
          DEFAULT: '#E11D48', // Vibrant fashion crimson accent
          hover: '#BE123C',
          light: '#FFE4E6',
        },
        gold: {
          DEFAULT: '#D97706',
          light: '#FEF3C7',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cinzel', 'Playfair Display', 'serif'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 12px 28px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.03)',
        floating: '0 20px 40px -15px rgba(0, 0, 0, 0.12)',
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [],
};
