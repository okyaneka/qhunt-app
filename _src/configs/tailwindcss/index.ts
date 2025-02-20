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
        boxShadow: {
          "card-sm": "rgba(0, 0, 0, 0.15) 0px 1px 7px",
          card: "rgba(0, 0, 0, 0.15) 0px 3px 11px",
          "card-lg": "rgba(0, 0, 0, 0.15) 0px 5px 15px",
          "card-xl": "rgba(0, 0, 0, 0.15) 0px 7px 19px",
        },
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
            950: "#191019",
          },
          light: "#ECC69F",
        },
      },
    },
  },
};

export default tailwindcss;
