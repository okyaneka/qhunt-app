import axios, { AxiosError, type AxiosResponse } from "axios";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { MutationOptions, UseQueryOptions } from "@tanstack/vue-query";
import type { DefaultResponse, MutationMethod } from "../types";
import type { ValueOf } from "qhunt-lib";
import { API } from "~/_src/constants";

export const get = <T = unknown>(
  url: MaybeRef<string>,
  options?: Partial<UseQueryOptions<T> & { params: Ref<any> }>
) => {
  const params = options?.params || null;

  return useQuery<T>({
    ...options,
    queryKey: [url, params],
    queryFn: () =>
      axios.get(unref(url), { params: params?.value }).then((res) => res.data),
  });
};

export const query = <T = unknown>(
  url: MaybeRef<ValueOf<typeof API>>,
  options?: Partial<UseQueryOptions<T> & { params: Ref<any> }>
) => {
  const params = options?.params || null;

  return useQuery<T>({
    ...options,
    queryKey: [url, params],
    queryFn: () =>
      axios.get(unref(url), { params: unref(params) }).then((res) => res.data),
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
  const { method = "post" } = options || {};
  return useMutation({
    ...options,
    mutationFn: async (payload) =>
      axios({ method, url: unref(url), data: payload }),
  });
};

const request = { get, query, mutate } as const;

export default request;
