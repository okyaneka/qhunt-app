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
    .then((res) => {
      const headers = res.headers;
      if (headers && headers["set-cookie"])
        setHeader(event, "Set-Cookie", headers["set-cookie"]);

      return res.data.data;
    })
    .catch((err: AxiosError<DefaultResponse>) => {
      const { response } = err;
      console.log();

      const headers = response?.headers;
      if (headers && headers["set-cookie"])
        setHeader(event, "Set-Cookie", headers["set-cookie"]);

      return null;
    });

  return res;
});
