import { env, font, ssr, icon, tailwindcss } from "./_src/configs";
import fs from "fs";
import path from "path";
import { pwa } from "./_src/configs";

// get data from package.json
const packagejson: any = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8")
);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  watch: ["./_src/configs/**/*"],
  components: [
    { prefix: "C", path: "./_src/components/", extensions: ["vue"] },
    { prefix: "CL", path: "./_src/components/_locals", extensions: ["vue"] },
  ],
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/png", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/apple/apple-touch-icon.png" },
        {
          rel: "apple-touch-icon",
          sizes: "57x57",
          href: "/apple/apple-touch-icon-57x57.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "72x72",
          href: "/apple/apple-touch-icon-72x72.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "76x76",
          href: "/apple/apple-touch-icon-76x76.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "114x114",
          href: "/apple/apple-touch-icon-114x114.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "120x120",
          href: "/apple/apple-touch-icon-120x120.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "144x144",
          href: "/apple/apple-touch-icon-144x144.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "152x152",
          href: "/apple/apple-touch-icon-152x152.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple/apple-touch-icon-180x180.png",
        },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: `${env.APP_NAME}: Aplikasi untuk Para Petualang`,
      meta: [
        { charset: "utf-8" },
        { name: "version", content: packagejson.version },
        {
          name: "description",
          content: packagejson.description,
        },
        { name: "author", content: "noone" },
        { name: "robots", content: "index, follow" },
      ],
    },

    layoutTransition: { name: "fade-quick", mode: "out-in" },
    pageTransition: { name: "fade-quick", mode: "out-in" },
  },
  ssr: true,
  routeRules: {
    "/__admin/**": { robots: false },
  },
  devServer: { port: env.PORT, host: "0.0.0.0" },
  alias: {
    "~src": "/_src",
  },
  runtimeConfig: {
    public: { ...env, APP_VERSION: packagejson.version },
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@vueuse/nuxt",
    "@pinia/nuxt",
    ["@nuxtjs/tailwindcss", tailwindcss],
    ["@nuxtjs/google-fonts", font],
    ["@nuxt/icon", icon],
    // ["@vite-pwa/nuxt", pwa],
    "@nuxtjs/seo",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
  ],
  sitemap: {
    exclude: ["/__admin/**"],
  },
  site: {
    indexable: true,
    url: env.APP_URL,
    name: env.APP_NAME,
  },
});
