import AuthService from "~/_src/services/auth";
import { useAuthStore } from "~/stores";

const AuthGlobalMiddleware = defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();

  if (authStore.auth) return;

  if (import.meta.client) {
    await AuthService.me();
  } else {
    const TID = useCookie("TID_API");
    if (TID.value)
      await AuthService.me({
        headers: { Cookie: `TID_API=${TID.value}` },
      });
  }
});

export default AuthGlobalMiddleware;
