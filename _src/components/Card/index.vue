<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { twMerge } from "tailwind-merge";

useAttrs();
const { contentClass, hoverable, noLine } = defineProps<{
  hoverable?: boolean;
  noLine?: boolean;
  contentClass?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    class="card bg-dark text-white p-1.5 rounded"
    :class="{
      'cursor-pointer hover:bg-dark hover:bg-opacity-90 transition': hoverable,
    }"
  >
    <slot v-if="noLine" />
    <div
      v-else
      :class="twMerge('p-2.5 border border-light no-underline', contentClass)"
    >
      <slot />
    </div>
  </div>
</template>
