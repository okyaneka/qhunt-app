import api from "../api";
import type { UserPublic } from "qhunt-lib";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import type { DefaultResponse } from "~/_src/helpers";

export const me = async (config?: AxiosRequestConfig) => {
  const res = await axios.get<DefaultResponse<UserPublic>>(api.auth.me, config);

  const authStore = useAuthStore();
  authStore.auth = res.data.data;

  return res;
};

const AuthService = { me } as const;

export default AuthService;
