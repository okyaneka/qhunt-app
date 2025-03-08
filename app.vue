<script setup lang="ts">
import ToastProvider from "~/_src/providers/ToastProvider/index.vue";
import { useEnv } from "./_src/configs/env";

const config = useEnv().public;

useSeoMeta({
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
