import axios, { AxiosError, AxiosHeaders, type AxiosInstance } from "axios";
import type { UserPublic } from "qhunt-lib";
import { API } from "~/_src/constants";
import type { DefaultResponse } from "~/_src/helpers";

export default defineEventHandler(async (event) => {
  const globalInstance = globalThis as { __API__?: AxiosInstance };
  const $api = globalInstance.__API__;
  if (!$api) throw createError("instance not found");

  const Cookie = getHeaders(event).cookie;
  const headers = new AxiosHeaders();
  if (Cookie) headers.set("Cookie", Cookie);

  const res = await $api
    .get<DefaultResponse<UserPublic>>(API.AUTH_ME, {
      withCredentials: true,
      headers,
    })
    .then((res) => {
      const headers = res.headers;
      if (headers && headers["set-cookie"])
        setHeader(event, "Set-Cookie", headers["set-cookie"]);

      return res.data.data;
    })
    .catch((err: AxiosError<DefaultResponse>) => {
      const { response } = err;

      const headers = response?.headers;
      if (headers && headers["set-cookie"])
        setHeader(event, "Set-Cookie", headers["set-cookie"]);

      return false;
    });

  return res;
});
