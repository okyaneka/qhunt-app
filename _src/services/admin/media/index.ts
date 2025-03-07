import type { MutateOptions } from "@tanstack/vue-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { S3, S3Foreign } from "qhunt-lib";
import { API } from "~/_src/constants";
import { request, type ExtendedMutationOptions } from "~/_src/helpers";

export const useMediaUpload = (
  options?: Partial<ExtendedMutationOptions<FormData, S3Foreign[]>>
) => {
  return request.mutate(API.MEDIA_UPLOAD, options);
};

export const useMediaDelete = (
  options: Partial<ExtendedMutationOptions<{ keys: string[] }>>
) => {
  return request.mutate(API.MEDIA_DELETE, options);
};
