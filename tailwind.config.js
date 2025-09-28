/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        bgPpal: {
          light: '#F7F7F7',
          dark: '#121212',
        },
        bgSec: {
          light: '#FFFFFF',
          dark: '#1E1E1E',
        },
        accent1: '#5036f6',
        accent2: '#e937b1',
        accent3: '#7B3AEC',
        titles: {
          light: '#1E1A30',
          dark: '#FFFFFF',
        },
        pg: {
          light: '#5E5E5E',
          dark: '#B0B0B0',
        },
        icons: {
          light: '#999999',
          dark: '#AAAAAA',
        },
        line: {
          light: '#E6E6E6',
          dark: '#333333',
        },
        shadow: {
          light: 'rgba(30, 26, 48, 0.1)',
          dark: 'rgba(0, 0, 0, 0.3)',
        },
      },
      backgroundImage: {
        'gradient-logo': 'linear-gradient(135deg, #5036f6, #e937b1)',
        'gradient-primary': 'linear-gradient(135deg, #5036f6, #7B3AEC)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}