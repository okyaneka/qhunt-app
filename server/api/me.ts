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
      const { response } = err;
      const headers = response?.headers;

      if (headers && headers["set-cookie"])
        setHeader(event, "Set-Cookie", headers["set-cookie"]);

      if (response?.status === 401) {
        return () => sendRedirect(event, "/login");
      } else if (err.response)
        throw createError({
          status: response?.status,
          message: err.response?.data.message || err.message,
        });
    });

  if (typeof res === "function") res();
  else if (res) {
    const resHeaders = res.headers;
    if (resHeaders && resHeaders["set-cookie"])
      setHeader(event, "Set-Cookie", resHeaders["set-cookie"]);

    return res.data.data;
  }
});
