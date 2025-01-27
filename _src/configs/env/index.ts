export const env = {
  PORT: Number(process.env.PORT) || 3000,
  APP_NAME: process.env.APP_NAME || "",
  APP_API_URL: process.env.APP_API_URL || "",
  APP_SOCKET_URL: process.env.APP_SOCKET_URL || "",
} as const;

export const useEnv = () => {
  const isInNuxtContext = typeof window !== "undefined" && window.__NUXT__;

  return isInNuxtContext ? useRuntimeConfig().public : env;
};

export default env;
