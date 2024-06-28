import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/solid-platform/',
  plugins: [react()],
  server: {
    proxy: {
      '/socket.io': {
        target: 'https://vps-3895181-x.dattaweb.com',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})
