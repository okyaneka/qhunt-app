<script setup lang="ts">
import type { Type } from "~/_src/helpers";

useAttrs();

const { type = "default" } = defineProps<{
  type?: Type;
}>();
</script>

<template>
  <div
    class="inline-block text-center rounded-2xl bg-opacity-80 px-2.5 py-0.5 font-sans"
    :class="{
      'bg-gray-700 text-white': type === 'default',
      'bg-blue-700 text-white': type === 'info',
      'bg-green-700 text-white': type === 'success',
      'bg-yellow-700 text-white': type === 'warning',
      'bg-red-700 text-white': type === 'error',
    }"
  >
    <slot />
  </div>
</template>
