<script setup lang="ts">
import type { Type } from "~/_src/helpers";

useAttrs();

const { type = "default" } = defineProps<{
  type?: Type | "white" | "dark";
}>();
</script>

<template>
  <div
    class="inline-block text-center rounded-2xl px-2.5 py-0.5 font-sans font-semibold"
    :class="{
      'bg-gray-700 text-white': type === 'default',
      'bg-blue-700 text-white': type === 'info',
      'bg-green-700 text-white': type === 'success',
      'bg-yellow-300 text-dark': type === 'warning',
      'bg-red-500 text-white': type === 'error',
      'bg-white text-black': type === 'white',
      'bg-dark text-white': type === 'dark',
    }"
  >
    <slot />
  </div>
</template>
