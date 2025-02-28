export const env = {
  PORT: Number(process.env.PORT) || 3000,
  APP_NAME: process.env.APP_NAME || "",
  APP_API_URL: process.env.APP_API_URL || "",
  APP_SOCKET_URL: process.env.APP_SOCKET_URL || "",

  FIREBASE_KEY: process.env.FIREBASE_KEY || "",
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || "",
} as const;

export const useEnv = () => {
  if (process.client) {
    return useRuntimeConfig().public;
  } else {
    return env;
  }
};

export default env;
