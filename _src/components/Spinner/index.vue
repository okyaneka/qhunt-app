<script setup lang="ts">
import { twMerge } from "tailwind-merge";

useAttrs();

const { light = false } = defineProps<{ light?: boolean }>();
</script>

<template>
  <div
    :class="twMerge('spinner w-4 h-4', String($attrs.class))"
    :style="{
      '--base-color': `var(--${light ? 'light' : 'dark'}-color)`,
    }"
  ></div>
</template>

<style scoped>
.spinner {
  --light-color: theme(colors.light.DEFAULT);
  --dark-color: theme(colors.dark.DEFAULT);
  --width: 3px;
  @apply rounded-full;
  background: radial-gradient(farthest-side, var(--base-color) 94%, #0000)
      top/var(--width) var(--width) no-repeat,
    conic-gradient(#0000 30%, var(--base-color));
  mask: radial-gradient(farthest-side, #0000 calc(100% - var(--width)), #000 0);
  animation: spinner 1s infinite linear;
}

@keyframes spinner {
  100% {
    transform: rotate(1turn);
  }
}
</style>
