import ssr from "~/_src/configs/ssr";
import { useAuthStore } from "~/stores";
import type { UserPublic } from "qhunt-lib";
import { push } from "~/_src/helpers/toast";

const AuthGlobalMiddleware = defineNuxtRouteMiddleware(async (to) => {
  if (ssr.includes(to.path)) return;
  const TID_API = useCookie("TID_API");

  const authStore = useAuthStore();
  if (authStore.auth) return;

  const headers = import.meta.server
    ? useRequestHeaders(["cookie"])
    : undefined;

  if (import.meta.client || TID_API.value) {
    const { data, error, refresh } = await useFetch<UserPublic>("/api/me", {
      credentials: "include",
      headers,
      lazy: import.meta.client,
      server: import.meta.server,
    });

    if (error.value && import.meta.client) {
      const message = error.value.data?.message || error.value.message;
      push(message, { type: "error" });
    }
    if (error.value || !data.value) await refresh();
    if (data.value) authStore.auth = data.value;
  }
});

export default AuthGlobalMiddleware;
