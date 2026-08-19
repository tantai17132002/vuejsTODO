import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  devServer: {
    port: Number(process.env.PORT) || 3000,
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3001",
    },
  },
  app: {
    head: {
      title: "ToDo Application",
      meta: [
        {
          name: "description",
          content: "ToDo Application helps you organize, track, and complete tasks easily",
        },
      ],
    },
  },
  pages: true,
  srcDir: ".",
  modules: ["@nuxt/eslint", "@pinia/nuxt", "@nuxtjs/i18n"],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    locales: [
      { code: "en", file: "en.json", name: "English", language: "en-US" },
      { code: "vi", file: "vi.json", name: "Tiếng Việt", language: "vi-VN" },
    ],
    defaultLocale: "vi",
    strategy: "no_prefix",
    langDir: "locales",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "preferred-locale",
      alwaysRedirect: false,
    },
  },
});
