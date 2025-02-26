import axios from "axios";
import type { UserPublic } from "qhunt-lib";
import { API } from "~/_src/constants";
import type { DefaultResponse } from "~/_src/helpers";

export const getMe = async () => {
  const res = await axios.get<DefaultResponse<UserPublic>>(API.AUTH_ME);
  const authStore = useAuthStore();
  authStore.auth = res.data.data;
};
