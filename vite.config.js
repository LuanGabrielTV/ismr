import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    fs: {
      allow: ['..']
    },
    cors: true
  },
  plugins: [
    react(),
    VitePWA({
      base: '/',
      scope: '/',
      strategy: 'generateSW',
      registerType: 'autoUpdate',
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://ismr-engine-service.onrender.com',
            handler: 'NetworkOnly',
            options: {
              cacheName: 'ismr-api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
              backgroundSync: {
                name: 'ismr-sync-queue',
                options: { maxRetentionTime: 24 * 60 },
              },
            }
          },
          {
            urlPattern: /\.(?:png|jpg|svg)$/,
            handler: 'CacheFirst',
            options: { cacheName: 'ismr-assets' }
          }
        ],
      },
      devOptions: {
        enabled: true,
        type: 'classic',
        navigateFallback: 'index.html',
      },
      manifest: {
        name: 'ismr',
        short_name: 'ismr',
        description: 'Aplicativo Text-to-Speech',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'logo192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'logo512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          },
          {
            src: 'logo192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      }
    })
  ],
})  
