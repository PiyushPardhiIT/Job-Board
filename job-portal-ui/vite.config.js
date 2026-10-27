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
          navy: "#1B2544",
          blue: "#275DF5",
          blueHover: "#1E4FD9",
          bgGray: "#F8F9FB",
          border: "#E2E8F0",
        }
      }
    },
  },
  plugins: [],
}