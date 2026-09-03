import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      // injectManifest (plutôt que generateSW) : le service worker généré
      // automatiquement n'a aucun hook pour les notifications push — on a
      // besoin d'un service worker à nous (src/sw.js) qui gère `push` et
      // `notificationclick`, avec le précache Workbox injecté dedans.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
      manifest: {
        name: 'AM Growth Solutions — CRM',
        short_name: 'AMGS CRM',
        description: 'CRM AM Growth Solutions',
        start_url: '/',
        display: 'standalone',
        theme_color: '#0A0A0B',
        background_color: '#0A0A0B',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/maskable-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
