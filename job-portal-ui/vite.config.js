import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
{import('tailwindcss').Config}

// https://vite.dev/config/
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        naukri: {
          navy: "#1B2544",       // Header background & dark text
          blue: "#275DF5",       // Primary Naukri CTA Blue
          blueHover: "#1E4FD9",  // Button hover state
          teal: "#0984E3",       // Secondary accent
          bgGray: "#F4F5F7",     // Card/Page background
          border: "#E2E8F0",     // Clean card borders
          textDark: "#1E2229",   // Job titles & primary text
          textMuted: "#8292B0",  // Subtitles & metadata
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
