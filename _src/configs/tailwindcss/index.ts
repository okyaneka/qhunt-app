import type { ModuleOptions } from "@nuxtjs/tailwindcss";

const tailwindcss: Partial<ModuleOptions> = {
  config: {
    content: ["_src/**/*.vue", "pages/**/*.vue"],
    plugins: [],
    theme: {
      fontFamily: {
        sans: ["Quicksand"],
        serif: ["Cormorant Infant", "ui-serif"],
      },
      extend: {
        colors: {
          dark: "#383038",
          light: "#ECC69F",
          hablebleb: "#120F91",
        },
      },
    },
  },
};

export default tailwindcss;
