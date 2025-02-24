import axios, { AxiosError, type AxiosResponse } from "axios";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { MutationOptions, UseQueryOptions } from "@tanstack/vue-query";
import { useEnv } from "~/_src/configs/env";
import { useToastProvider } from "~/_src/providers/ToastProvider";
import type { DefaultResponse, MutationMethod } from "../types";

const env = useEnv();
const { push } = useToastProvider();

axios.defaults.baseURL = env.APP_API_URL;
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (res) => res,
  (err: AxiosError<DefaultResponse>) => {
    if (process.client) {
      const message = err.response?.data.message || err.message;
      push(message, { type: "error" });
    }
    return Promise.reject(err);
  }
);

export const get = <T = unknown>(
  url: MaybeRef<string>,
  options?: Partial<UseQueryOptions<T> & { params: Ref<any> }>
) => {
  const params = options?.params || null;

  return useQuery<T>({
    ...options,
    queryKey: [url, params],
    queryFn: () =>
      axios
        .get(toRef(url).value, { params: params?.value })
        .then((res) => res.data),
  });
};

export const query = <T = unknown>(
  url: MaybeRef<string>,
  options?: Partial<UseQueryOptions<T> & { params: Ref<any> }>
) => {
  const params = options?.params || null;

  return useQuery<T>({
    ...options,
    queryKey: [url, params],
    queryFn: () =>
      axios
        .get(toRef(url).value, { params: params?.value })
        .then((res) => res.data),
  });
};

export const mutate = <V = unknown, T = unknown>(
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
  const { method = "post" } = options || {};
  return useMutation({
    ...options,
    mutationFn: async (payload) =>
      axios({ method, url: toRef(url).value, data: payload }),
  });
};

const request = { get, query, mutate } as const;

export default request;
