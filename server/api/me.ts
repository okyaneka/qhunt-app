import axios, { AxiosHeaders } from "axios";
import type { UserPublic } from "qhunt-lib";
import { API } from "~/_src/constants";
import type { DefaultResponse } from "~/_src/helpers";

export default defineEventHandler(async (event) => {
  const Cookie = getHeaders(event).cookie;
  const headers = new AxiosHeaders();
  if (Cookie) headers.set("Cookie", Cookie);

  const { data, ...res } = await axios.get<DefaultResponse<UserPublic>>(
    API.AUTH_ME,
    {
      withCredentials: true,
      headers,
    }
  );

  const setCookieHeader = res.headers["set-cookie"];
  if (setCookieHeader) setHeader(event, "Set-Cookie", setCookieHeader);

  return data.data;
});
