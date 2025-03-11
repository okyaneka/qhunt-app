import type { ModuleOptions } from "@vite-pwa/nuxt";
import { env } from "./env";
import packageJson from "../../package.json";

const pwa: ModuleOptions = {
  registerType: "prompt",
  manifest: {
    name: env.APP_NAME,
    short_name: env.APP_NAME,
    description: packageJson.description,
    orientation: "portrait",
    lang: "id",
    scope: "/",
    theme_color: "#383038",
    background_color: "#FFFFFF",
    display: "fullscreen",
    start_url: "/home",
    icons: [
      {
        src: "icons/icon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        src: "icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "icons/icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "icons/icon-167x167.png",
        sizes: "167x167",
        type: "image/png",
      },
      {
        src: "icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        src: "icons/icon-120x120.png",
        sizes: "120x120",
        type: "image/png",
      },
      {
        src: "icons/icon-76x76.png",
        sizes: "76x76",
        type: "image/png",
      },
      {
        src: "icons/icon-70x70.png",
        sizes: "70x70",
        type: "image/png",
      },
      {
        src: "icons/icon-150x150.png",
        sizes: "150x150",
        type: "image/png",
      },
      {
        src: "icons/icon-310x310.png",
        sizes: "310x310",
        type: "image/png",
      },
    ],
    categories: [
      "game",
      "adventure",
      "puzzle",
      "trivia",
      "quiz",
      "challenge",
      "education",
      "learning",
    ],
    screenshots: [
      {
        form_factor: "narrow",
        sizes: "480x640",
        src: "splash/splash-480x640.png",
      },
      {
        form_factor: "wide",
        sizes: "720x960",
        src: "splash/splash-720x960.png",
      },
    ],
  },

  workbox: {
    // navigateFallback: "/home",
    // clientsClaim: true,
    maximumFileSizeToCacheInBytes: 5e6,
    // globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
  },
  devOptions: {
    enabled: true,
    type: "module",
  },
};

export default pwa;
