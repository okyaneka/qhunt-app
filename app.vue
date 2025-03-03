<script setup lang="ts">
import ToastProvider from "~/_src/providers/ToastProvider/index.vue";
</script>

<template>
  <VitePwaManifest />
  <ToastProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ToastProvider>
</template>
