<script setup lang="ts">
import ToastProvider from "~/_src/providers/ToastProvider";
</script>

<template>
  <ToastProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ToastProvider>
</template>
