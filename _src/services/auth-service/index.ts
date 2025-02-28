import { API } from "~/_src/constants";
import type {
  Auth,
  UserLoginPayload,
  UserPayload,
  UserPublic,
  UserPublicPayload,
} from "qhunt-lib";
import { request, routes } from "~/_src/helpers";
import { getMe } from "../_locals";
import { push } from "~/_src/helpers/toast";
import type { User } from "firebase/auth";
import { firebase } from "qhunt-lib/plugins/firebase";

export const login = () => {
  return request.mutate<UserLoginPayload, Auth>(API.AUTH_LOGIN, {
    onSuccess: () => getMe(),
  });
};

export const register = () => {
  return request.mutate<UserPayload, Auth>(API.AUTH_REGISTER, {
    onSuccess: () => getMe(),
  });
};

export const googleSign = () => {
  return request.mutate<User, Auth>(API.AUTH_GOOGLE_SIGN, {
    onSuccess: () => getMe(),
  });
};

export const edit = () => {
  const authStore = useAuthStore();
  return request.mutate<UserPublicPayload, UserPublic>(API.AUTH_EDIT, {
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
  return request.mutate<FormData, UserPublic>(API.AUTH_PHOTO, {
    method: "PUT",
    onSuccess: async (res) => {},
  });
};

export const logout = () => {
  const authStore = useAuthStore();
  const router = useRouter();

  return request.mutate(API.AUTH_LOGOUT, {
    onSuccess: () => {
      firebase.signOut();
      authStore.auth = undefined;
      push("Berhasil Logout", { type: "success" });
      router.push(routes.login);
    },
  });
};

const AuthService = {
  register,
  googleSign,
  edit,
  photo,
  logout,
  login,
} as const;

export default AuthService;
