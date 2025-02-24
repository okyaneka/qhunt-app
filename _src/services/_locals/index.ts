import api from "../api";
import axios from "axios";
import type { UserPublic } from "qhunt-lib";
import type { DefaultResponse } from "~/_src/helpers";

export const getMe = async () => {
  const res = await axios.get<DefaultResponse<UserPublic>>(api.auth.me);
  const authStore = useAuthStore();
  authStore.auth = res.data.data;
};
