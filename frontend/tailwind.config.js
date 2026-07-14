/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1652F0',
          hover: '#123FC0',
          dark: '#0A1F44',
          darkHover: '#132a5c',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#141822',
          subtle: '#FAFAFB',
          border: '#E2E4E9',
          borderDark: '#232838',
        },
        text: {
          DEFAULT: '#101828',
          muted: '#5B6472',
          light: '#F5F7FA',
          lightMuted: '#9AA3B2',
        }
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      keyframes: {
        perimoFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        perimoSpin: {
          to: { transform: 'rotate(360deg)' },
        },
        perimoPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
      },
      animation: {
        'perimo-fade': 'perimoFadeIn 250ms ease-out',
        'perimo-spin': 'perimoSpin 1.15s linear infinite',
        'perimo-pulse': 'perimoPulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
