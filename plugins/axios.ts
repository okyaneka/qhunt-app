import axios, { AxiosError, type AxiosInstance } from "axios";
import { useEnv } from "~/_src/configs/env";
import { routes, type DefaultResponse } from "~/_src/helpers";
import { createApi } from "~/_src/helpers/request";
import { useToastProvider } from "~/_src/providers/ToastProvider";

export default defineNuxtPlugin(() => {
  const api = createApi();

  return { provide: { api } };
});
