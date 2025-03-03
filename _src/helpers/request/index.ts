import axios, { AxiosError, type AxiosResponse } from "axios";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { MutationOptions, UseQueryOptions } from "@tanstack/vue-query";
import type { DefaultResponse, MutationMethod } from "../types";
import type { ValueOf } from "qhunt-lib";
import { API } from "~/_src/constants";
import { useEnv } from "~/_src/configs/env";
import { useToastProvider } from "~/_src/providers/ToastProvider";
import routes from "../routes";

export const createApi = () => {
  const env = useEnv();

  const api = axios.create({
    baseURL: env.public.APP_API_URL,
    withCredentials: true,
  });

  const onError = async (err: AxiosError<DefaultResponse>) => {
    if (import.meta.server) return;

    const { push } = useToastProvider();
    const res = err.response?.data;
    const authStore = useAuthStore();
    const router = useRouter();

    const message = res?.message || err.message;
    if (res && message == "validation_error") {
      const validation = Object.values(res.error?.validation || {}) as any;
      push(validation[0], { type: "error" });
    } else push(message, { type: "error" });

    if (res?.code == 401) {
      authStore.auth = undefined;
      await useFetch("/api/me", { credentials: "include" });
      router.push(routes.login);
    }
  };

  api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (res) => res,
    async (err: AxiosError<DefaultResponse>) => {
      await onError(err);
      return Promise.reject(err);
    }
  );

  return api;
};

export const get = <T = unknown>(
  url: MaybeRef<string>,
  options?: Partial<UseQueryOptions<T> & { params: Ref<any> }>
) => {
  const { $api } = useNuxtApp();
  const params = options?.params || null;

  return useQuery<T>({
    ...options,
    queryKey: [url, params],
    queryFn: () =>
      $api.get(unref(url), { params: params?.value }).then((res) => res.data),
  });
};

export const query = <T = unknown>(
  url: MaybeRef<ValueOf<typeof API>>,
  options?: Partial<UseQueryOptions<T> & { params: Ref<any> }>
) => {
  const { $api } = useNuxtApp();
  const params = options?.params || null;

  return useQuery<T>({
    ...options,
    queryKey: [url, params],
    queryFn: () =>
      $api.get(unref(url), { params: unref(params) }).then((res) => res.data),
  });
};

export const mutate = <V = void, T = unknown>(
  url: MaybeRef<string>,
  options?: Partial<
    MutationOptions<
      AxiosResponse<DefaultResponse<T>>,
      AxiosError<DefaultResponse>,
      V
    > & {
      method: MutationMethod;
    }
  >
) => {
  const { $api } = useNuxtApp();
  const { method = "post" } = options || {};

  return useMutation({
    ...options,
    mutationFn: async (payload) =>
      $api({ method, url: unref(url), data: payload }),
  });
};

const request = { get, query, mutate } as const;

export default request;
