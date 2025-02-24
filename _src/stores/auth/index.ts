import { defineStore } from "pinia";
import type { UserPublic } from "qhunt-lib";

const useAuthStore = defineStore("auth-store", () => {
  const auth = ref<UserPublic>();
  const token = useCookie("TOKEN_LOCAL");

  return { auth, token };
});

export default useAuthStore;
