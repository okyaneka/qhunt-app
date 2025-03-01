import axios, { AxiosError } from "axios";
import { useEnv } from "~/_src/configs/env";
import { routes, type DefaultResponse } from "~/_src/helpers";
import { useToastProvider } from "~/_src/providers/ToastProvider";

export default defineNuxtPlugin(() => {
  const { push } = useToastProvider();
  const authStore = useAuthStore();
  const env = useEnv();
  const router = useRouter();
  const nuxtApp = useNuxtApp();

  nuxtApp.hook("app:created", () => {
    axios.defaults.baseURL = env.public.APP_API_URL;
    axios.defaults.withCredentials = true;

    axios.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (res) => res,
      async (err: AxiosError<DefaultResponse>) => {
        const res = err.response?.data;
        if (import.meta.client) {
          const message = res?.message || err.message;
          if (res && message == "validation_error") {
            const validation = Object.values(
              res.error?.validation || {}
            ) as any;
            push(validation[0], { type: "error" });
          } else push(message, { type: "error" });

          if (res?.code == 401) {
            authStore.auth = undefined;
            await useFetch("/api/me", { credentials: "include" });
            router.push(routes.login);
          }
        }
        return Promise.reject(err);
      }
    );
  });
});
