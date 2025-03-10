import type { ModuleOptions } from "@nuxtjs/tailwindcss";

const tailwindcss: Partial<ModuleOptions> = {
  cssPath: "~/main.css",
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
            DEFAULT: "rgb(72, 53, 44)",
            50: "rgb(246, 243, 241)",
            100: "rgb(229, 218, 212)",
            200: "rgb(211, 193, 183)",
            300: "rgb(194, 168, 154)",
            400: "rgb(176, 143, 125)",
            500: "rgb(159, 118, 96)",
            600: "rgb(130, 96, 79)",
            700: "rgb(101, 75, 61)",
            800: "rgb(72, 53, 44)",
            900: "rgb(43, 32, 26)",
            950: "rgb(14, 11, 9)",
          },
          light: {
            DEFAULT: "#ECC69F",
            50: "rgb(251, 243, 236)",
            100: "rgb(244, 221, 197)",
            200: "rgb(236, 198, 158)",
            300: "rgb(228, 175, 120)",
            400: "rgb(221, 152, 81)",
            500: "rgb(213, 129, 42)",
            600: "rgb(174, 105, 34)",
            700: "rgb(135, 82, 27)",
            800: "rgb(97, 58, 19)",
            900: "rgb(58, 35, 11)",
            950: "rgb(19, 12, 4)",
          },
        },
      },
    },
  },
};

export default tailwindcss;
