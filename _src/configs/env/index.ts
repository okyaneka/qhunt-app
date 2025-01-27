export const useEnv = () => {
  const isInNuxtContext = typeof window !== "undefined" && window.__NUXT__;
  if (isInNuxtContext) return useRuntimeConfig().public;
  return;
};

export default { useEnv };
