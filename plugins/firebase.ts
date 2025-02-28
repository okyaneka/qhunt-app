import { firebase } from "qhunt-lib/plugins/firebase";
import { useEnv } from "~/_src/configs/env";

export default defineNuxtPlugin(() => {
  const env = useEnv();

  firebase.init({
    apiKey: env.FIREBASE_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
  });
});
