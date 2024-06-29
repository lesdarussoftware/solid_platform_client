import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/solid-platform/',
  plugins: [
    react(),
    VitePWA({
      manifest: {
        "name": "Solid Platform",
        "short_name": "Solid",
        "start_url": "/solid-platform/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#000000",
        "icons": [
          {
            "src": "/logo.jpeg",
            "sizes": "500x500",
            "type": "image/jpeg"
          }
        ]
      },
      registerType: 'autoUpdate'
    })
  ],
})
