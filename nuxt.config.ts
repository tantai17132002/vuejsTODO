// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  devServer: {
    port: Number(process.env.PORT) || 3000,
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
    },
  },
  // Cấu hình pages directory
  pages: true,
  // Đảm bảo Nuxt nhận ra thư mục pages
  srcDir: '.',
  modules: [
    "@nuxt/ui",
    "@nuxt/test-utils",
    "@nuxt/scripts",
    "@nuxt/image",
    "@nuxt/eslint",
    "@nuxt/content",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
  ],
  css: ['~/assets/css/main.css'],
  
  // Cấu hình i18n
  i18n: {
    locales: [
      { code: 'en', file: 'en.json', name: 'English', iso: 'en-US' },
      { code: 'vi', file: 'vi.json', name: 'Tiếng Việt', iso: 'vi-VN' }
    ],
    defaultLocale: 'vi',
    strategy: 'prefix_except_default',
    lazy: true,
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },
  
  // Cấu hình Vite để watch file ngôn ngữ
  vite: {
    server: {
      watch: {
        ignored: ['!**/locales/**']
      }
    }
  },
  
  // Tắt font optimization để tránh lỗi build
  fonts: {
    experimental: {
      processCSSVariables: false
    }
  }
});
