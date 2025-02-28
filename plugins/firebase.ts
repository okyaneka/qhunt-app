import { firebase } from "qhunt-lib/plugins/firebase";
import { useEnv } from "~/_src/configs/env";

export default defineNuxtPlugin(() => {
  const env = useEnv();

  firebase.init({
    apiKey: env.public.FIREBASE_KEY,
    authDomain: env.public.FIREBASE_AUTH_DOMAIN,
  });
});
