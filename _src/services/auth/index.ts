import api from "../api";
import type {
  Auth,
  UserPayload,
  UserPublic,
  UserPublicPayload,
} from "qhunt-lib";
import { request } from "~/_src/helpers";
import { getMe } from "../_locals";

export const register = () => {
  return request.mutate<UserPayload, Auth>(api.auth.register, {
    onSuccess: async () => {
      await getMe();
    },
  });
};

export const edit = () => {
  const authStore = useAuthStore();
  return request.mutate<UserPublicPayload, UserPublic>(api.auth.edit, {
    method: "PUT",
    onSuccess: async (res) => {
      const {
        data: { data },
      } = res;
      authStore.auth = data;
    },
  });
};

export const photo = () => {
  return request.mutate<FormData, UserPublic>(api.auth.photo, {
    method: "PUT",
    onSuccess: async (res) => {},
  });
};

const AuthService = { register, edit, photo } as const;

export default AuthService;
