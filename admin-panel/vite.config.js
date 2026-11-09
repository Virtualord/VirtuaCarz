import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Production builds are served by the API at /admin/.
  base: command === 'build' ? '/admin/' : '/',
  plugins: [tailwindcss(), react()],
}))
