import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Native file events can miss saves from some editors on macOS
      usePolling: true,
      interval: 100,
    },
  },
})
