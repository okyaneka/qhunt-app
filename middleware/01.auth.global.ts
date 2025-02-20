import ssr from "~/_src/configs/ssr";
import AuthService from "~/_src/services/auth";
import { useAuthStore } from "~/stores";

const AuthGlobalMiddleware = defineNuxtRouteMiddleware(async (to) => {
  if (ssr.includes(to.path)) return;

  if (import.meta.client) {
    const authStore = useAuthStore();
    if (authStore.auth) return;
    await AuthService.me().catch((err) => err);
  }
});

export default AuthGlobalMiddleware;
