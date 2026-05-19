// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n'],
  i18n: {
    defaultLocale: 'en',
    strategy: 'no_prefix',
    locales: [
      { code: 'en', name: 'English',    file: 'en.json' },
      { code: 'id', name: 'Indonesian', file: 'id.json' },
      { code: 'pt', name: 'Portuguese', file: 'pt.json' },
    ],
    langDir: 'locales',
    bundle: {
      optimizeTranslationDirective: false,
    },
  },
  css: [
    '@/assets/css/pixel.css' // make sure to load pixel.css file at the very last
  ],
  postcss: {
    plugins: {
      '@mekari/pixel3-postcss': {
      }
    }
  }
})
