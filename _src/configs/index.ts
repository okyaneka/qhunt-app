import env from "./env";
import font from "./font";
import icon from "./icon";
import ssr from "./ssr";
import tailwindcss from "./tailwindcss";

export { env, tailwindcss, icon, ssr, font };

const configs = {
  env,
  tailwindcss,
  icon,
  ssr,
  font,
} as const;

export default configs;
