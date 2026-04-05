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
        importScripts: ['/push-notification-handler.js'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://ismr-engine-service.onrender.com',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'ismr-api-cache',
              networkTimeoutSeconds: 5,
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
              // Background Sync requires this for POST requests
              plugins: [
                {
                  fetchDidFail: async ({ error }) => {
                    console.log("Background Sync triggered due to fetch failure", error);
                  }
                }, {
                  handlerDidError: async () => {
                    console.log("Request failed, checking sync queue...");
                    return null;
                  }
                }
              ]
            },
            method: 'PUT'
          },
          // {
          //   urlPattern: ({ url }) => url.origin === 'https://ismr-engine-service.onrender.com',
          //   handler: 'NetworkOnly', // Use NetworkOnly for data you want to SYNC later
          //   options: {
          //     backgroundSync: {
          //       name: 'ismr-sync-queue',
          //       options: { maxRetentionTime: 24 * 60 },
          //     },
          //     // Background Sync requires this for POST requests
          //     plugins: [
          //       {
          //         fetchDidFail: async ({ error }) => {
          //           console.log("Background Sync triggered due to fetch failure", error);
          //         }
          //       }, {
          //         handlerDidError: async () => {
          //           console.log("Request failed, checking sync queue...");
          //           return null;
          //         }
          //       }
          //     ]
          //   },
          //   method: 'PUT' // Background Sync is most commonly used for POSTing data
          // },
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
