<script setup lang="ts">
import { routes } from "~/_src/helpers";

const bgUrl =
  "https://png.pngtree.com/thumb_back/fh260/background/20230413/pngtree-medieval-castle-game-scene-image_2360284.jpg";

const isLoaded = ref(false);

const loadAssets = () => {
  const assets = [bgUrl];
  Promise.all(
    assets.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  ).finally(() => {
    isLoaded.value = true;
  });
};

onMounted(() => {
  loadAssets();
});
</script>

<template>
  <main class="default min-h-screen p-3 !bg-fixed bg-cover">
    <div class="max-w-lg mx-auto">
      <slot />
    </div>

    <div class="fixed right-4 bottom-4 flex">
      <CTooltip>
        <CButton size="lg" icon as="link" :to="routes.scan.index">
          <Icon name="ri:qr-code-fill" />
        </CButton>
        <template #content> Scan Kode QR </template>
      </CTooltip>
    </div>
  </main>
</template>
