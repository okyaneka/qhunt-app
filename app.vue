<script setup lang="ts">
import ToastProvider from "~/_src/providers/ToastProvider/index.vue";
import { useEnv } from "./_src/configs/env";

const config = useEnv().public;

useHead({
  script: [
    {
      async: true,
      src: "https://www.googletagmanager.com/gtag/js?id=G-FRC9WQZVTR",
    },
    {
      innerHTML: `function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","G-FRC9WQZVTR");`,
    },
  ],
});

useSeoMeta({
  // @ts-ignore
  "google-adsense-account": config.GOOGLE_ADSENSE,
});
</script>

<template>
  <VitePwaManifest />
  <ToastProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ToastProvider>
</template>
