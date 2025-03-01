import { API } from "~/_src/constants";
import type {
  Auth,
  UserLoginPayload,
  UserPasswordPayload,
  UserPayload,
  UserPublic,
  UserPublicFull,
  UserPublicPayload,
} from "qhunt-lib";
import { type DefaultResponse, request, routes } from "~/_src/helpers";
import { getMe } from "../_locals";
import { push } from "~/_src/helpers/toast";
import type { User } from "firebase/auth";
import { firebase } from "qhunt-lib/plugins/firebase";

export const login = () => {
  return request.mutate<UserLoginPayload, Auth>(API.AUTH_LOGIN, {
    onSuccess: () => getMe(),
  });
};

export const me = () => {
  return request.query<DefaultResponse<UserPublicFull>>(API.AUTH_ME_FULL);
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

export const password = () => {
  const router = useRouter();
  return request.mutate<UserPasswordPayload, UserPublic>(API.AUTH_PASSWORD, {
    method: "patch",
    onSuccess: () => getMe(),
  });
};

export const photo = () => {
  return request.mutate<FormData, UserPublic>(API.AUTH_PHOTO, {
    method: "patch",
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
  edit,
  googleSign,
  login,
  logout,
  password,
  me,
  photo,
  register,
} as const;

export default AuthService;
