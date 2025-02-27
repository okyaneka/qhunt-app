import ssr from "~/_src/configs/ssr";
import { useAuthStore } from "~/stores";
import { getMe } from "~/_src/services/_locals";
import dayjs from "dayjs";
import type { UserPublic } from "qhunt-lib";

const AuthGlobalMiddleware = defineNuxtRouteMiddleware(async (to) => {
  if (ssr.includes(to.path)) return;

  const authStore = useAuthStore();
  if (authStore.auth) return;

  const headers = import.meta.server
    ? useRequestHeaders(["cookie"])
    : undefined;

  const { data } = await useFetch<UserPublic>("/api/me", {
    credentials: "include",
    headers,
    lazy: import.meta.client,
  });

  if (data.value) authStore.auth = data.value;
});

export default AuthGlobalMiddleware;
