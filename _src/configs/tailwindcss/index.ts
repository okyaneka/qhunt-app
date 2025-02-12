import type { ModuleOptions } from "@nuxtjs/tailwindcss";

const tailwindcss: Partial<ModuleOptions> = {
  config: {
    content: ["_src/**/*.vue", "pages/**/*.vue", "layouts/**/*.vue"],
    plugins: [],
    theme: {
      fontFamily: {
        sans: ["Quicksand"],
        serif: ["Cormorant Infant", "ui-serif"],
      },
      extend: {
        colors: {
          dark: {
            DEFAULT: "#383038",
            50: "#e9e8e9",
            100: "#d3d1d3",
            200: "#bdbabd",
            300: "#a7a3a7",
            400: "#908c90",
            500: "#7a757a",
            600: "#645e64",
            700: "#4e474e",
            800: "#383038",
            900: "#221922",
          },
          light: "#ECC69F",
          hablebleb: "#120F91",
        },
      },
    },
  },
};

export default tailwindcss;
