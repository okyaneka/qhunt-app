import type {
  DehydratedState,
  VueQueryPluginOptions,
} from "@tanstack/vue-query";
import {
  VueQueryPlugin,
  QueryClient,
  hydrate,
  dehydrate,
} from "@tanstack/vue-query";

export default defineNuxtPlugin((nuxt) => {
  const vueQueryState = useState<DehydratedState | null>("vue-query");

  const queryClient = new QueryClient();
  const options: VueQueryPluginOptions = { queryClient };

  nuxt.vueApp.use(VueQueryPlugin, options);

  if (import.meta.client) {
    hydrate(queryClient, vueQueryState.value);
  }
});
