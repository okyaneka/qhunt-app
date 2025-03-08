import type { UseFetchOptions } from "#app";
import type { Feature } from "qhunt-lib";
import { useEnv } from "~/_src/configs/env";
import { API } from "~/_src/constants";
import {
  request,
  type DefaultResponse,
  type DefaultResponseList,
  type ExtendedMutationOptions,
  type ExtendedQueryOptions,
} from "~/_src/helpers";

export const useFeatureList = (
  options?: Partial<ExtendedQueryOptions<DefaultResponseList<Feature>>>
) => {
  return request.query(API.ADMIN_FEATURE_LIST, options);
};

export const useFeatureCreate = () => {
  return request.mutate<FormData, Feature>(API.ADMIN_FEATURE_CREATE);
};

export const useFeatureDetail = (
  id: string,
  options?: Partial<ExtendedQueryOptions<DefaultResponse<Feature>>>
) => {
  return request.query<DefaultResponse<Feature>>(
    API.ADMIN_FEATURE_DETAIL(id),
    options
  );
};

export const useFeatureUpdate = (
  id: string,
  options?: Partial<ExtendedMutationOptions<FormData>>
) => {
  return request.mutate(API.ADMIN_FEATURE_UPDATE(id), {
    ...options,
    method: "put",
  });
};

export const useFeatureDelete = (
  id: MaybeRef<string>,
  options?: Partial<ExtendedMutationOptions>
) => {
  const url = computed(() => API.ADMIN_FEATURE_DELETE(toValue(id)));
  console.log(url.value);

  return request.mutate(url, {
    ...options,
    method: "delete",
  });
};

export const useFeatureDetailPublished = (
  type: string,
  slug: string,
  options?: Partial<ExtendedQueryOptions<DefaultResponse<Feature>>>
) => {
  return request.query(API.FEATURE_PUBLISHED(type, slug), options);
};

export const useFeatureListFetch = (
  options?: UseFetchOptions<DefaultResponseList<Feature>>
) => {
  const config = useEnv().public;
  return useFetch(`${config.APP_API_URL}${API.FEATURE_LIST}`, {
    ...options,
    method: "get",
    credentials: "include",
  });
};

export const useFeatureDetailFetch = (
  type: string,
  slug: string,
  options?: UseFetchOptions<DefaultResponse<Feature>>
) => {
  const config = useEnv().public;
  return useFetch(`${config.APP_API_URL}${API.FEATURE_PUBLISHED(type, slug)}`, {
    ...options,
    method: "get",
    credentials: "include",
  });
};
