import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.emailjs.com; connect-src 'self' https://api.emailjs.com https://*.firebaseio.com https://*.googleapis.com https://*.run.app wss://*.firebaseio.com; img-src 'self' data: https://*.firebasestorage.app blob:; style-src 'self' 'unsafe-inline';",
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
    proxy: {
      '/api/contact': {
        target: 'http://127.0.0.1:5001/hangar-one-precision/us-central1/sendContactEmail',
        changeOrigin: true,
        rewrite: () => '',
      },
    },
  },
})