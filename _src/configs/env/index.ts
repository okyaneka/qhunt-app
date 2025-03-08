export const env = {
  PORT: Number(process.env.PORT) || 3000,
  APP_NAME: process.env.APP_NAME || "",
  APP_URL: process.env.NUXT_PUBLIC_APP_URL,
  APP_API_URL: "",
  APP_SOCKET_URL: "",
  FIREBASE_KEY: "",
  FIREBASE_AUTH_DOMAIN: "",
  TINY_MCE_KEY: "",
  GOOGLE_ADSENSE: process.env.GOOGLE_ADSENSE || "",
} as const;

export const useEnv = () => {
  return useRuntimeConfig();
};

export default env;
