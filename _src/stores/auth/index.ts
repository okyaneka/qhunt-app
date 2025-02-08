import { defineStore } from "pinia";
import type { UserPublic } from "qhunt-lib";

const useAuthStore = defineStore("auth-store", () => {
  const auth = ref<UserPublic>();

  return { auth };
});

export default useAuthStore;
