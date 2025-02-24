import ssr from "~/_src/configs/ssr";
import { useAuthStore } from "~/stores";
import { getMe } from "~/_src/services/_locals";

const AuthGlobalMiddleware = defineNuxtRouteMiddleware(async (to) => {
  if (ssr.includes(to.path)) return;

  if (import.meta.client) {
    const authStore = useAuthStore();
    if (authStore.auth) return;
    await getMe();
  }
});

export default AuthGlobalMiddleware;
