// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // Disable server-side rendering
  target: "static", // Generate a static app
  app: {
      baseURL: '/', // Replace <repo-name> with your GitHub repository name
    },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],
  pwa: {
    strategies: 'generateSW',
    registerType: 'autoUpdate',
    manifest: {
      name: 'Shake Lingo',
      short_name: 'ShakeLingo',
      theme_color: '#00183B',
      icons: [
        {
          src: 'logo-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'logo-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'logo-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'],
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'],
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },
  css: [
    '@fortawesome/fontawesome-free/css/all.min.css',
  ]
})