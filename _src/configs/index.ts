import env from "./env";
import icon from "./icon";
import tailwindcss from "./tailwindcss";

export { env, tailwindcss, icon };

const configs = {
  env,
  tailwindcss,
  icon,
} as const;

export default configs;
