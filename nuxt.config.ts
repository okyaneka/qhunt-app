import { tailwindcss, icon } from "./_src/configs";
import { env } from "./_src/configs/env";
import fs from "fs";
import path from "path";
import font from "./_src/configs/font";

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

    layoutTransition: { name: "page-fade", mode: "out-in" },
    pageTransition: { name: "page-fade", mode: "out-in" },
  },
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
