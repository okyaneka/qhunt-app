import AuthService from "~/_src/services/auth";
import { useAuthStore } from "~/stores";

const AuthGlobalMiddleware = defineNuxtRouteMiddleware(async () => {
  if (import.meta.client) {
    const authStore = useAuthStore();
    if (authStore.auth) return;
    await AuthService.me();
  }
});

export default AuthGlobalMiddleware;
