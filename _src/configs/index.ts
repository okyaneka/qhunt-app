import env from "./env";
import font from "./font";
import icon from "./icon";
import pwa from "./pwa";
import ssr from "./ssr";
import tailwindcss from "./tailwindcss";

export { env, tailwindcss, icon, ssr, font, pwa };

const configs = {
  env,
  tailwindcss,
  icon,
  ssr,
  pwa,
  font,
} as const;

export default configs;
