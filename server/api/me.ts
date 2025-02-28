import axios, { AxiosError, AxiosHeaders } from "axios";
import type { UserPublic } from "qhunt-lib";
import { API } from "~/_src/constants";
import type { DefaultResponse } from "~/_src/helpers";

export default defineEventHandler(async (event) => {
  const Cookie = getHeaders(event).cookie;
  const headers = new AxiosHeaders();
  if (Cookie) headers.set("Cookie", Cookie);

  const res = await axios
    .get<DefaultResponse<UserPublic>>(API.AUTH_ME, {
      withCredentials: true,
      headers,
    })
    .catch((err: AxiosError<DefaultResponse>) => {
      const headers = err.response?.headers;

      if (headers) setHeader(event, "Set-Cookie", headers["set-cookie"]);

      throw createError({
        status: err.status,
        message: err.response?.data.message || err.message,
      });
    });

  setHeader(event, "Set-Cookie", res.headers["set-cookie"]);

  return res.data.data;
});
