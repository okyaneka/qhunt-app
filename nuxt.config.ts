import { env, font, ssr, icon, tailwindcss } from "./_src/configs";
import fs from "fs";
import path from "path";

// get data from package.json
const packagejson: any = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8")
);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  watch: ["./_src/configs/**/*"],
  css: ["@/main.css"],
  components: [
    { prefix: "C", path: "./_src/components/", extensions: ["vue"] },
  ],
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: env.APP_NAME,
      meta: [{ name: "description", content: packagejson.description }],
    },

    layoutTransition: { name: "fade-quick", mode: "out-in" },
    pageTransition: { name: "fade-quick", mode: "out-in" },
  },
  ssr: false,
  routeRules: Object.fromEntries(ssr.map((route) => [route, { ssr: true }])),
  devServer: { port: env.PORT, host: "0.0.0.0" },
  alias: {
    "~src": "/_src",
  },
  runtimeConfig: {
    public: env,
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    ["@nuxtjs/tailwindcss", tailwindcss],
    ["@nuxtjs/google-fonts", font],
    ["@nuxt/icon", icon],
    "@vueuse/nuxt",
    "@pinia/nuxt",
  ],
});
