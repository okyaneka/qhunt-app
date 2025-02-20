<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import type { HTMLAttributes } from "vue";

type Props = {
  faded: boolean;
  hoverable: boolean;
  contentClass: HTMLAttributes["class"];
};

useAttrs();

const { hoverable, contentClass } = defineProps<Partial<Props>>();
</script>

<template>
  <div
    class="rounded-lg overflow-clip"
    :class="{
      'cursor-pointer transition-all hover:z-[9999]': hoverable,
      'hover:shadow-card-lg': hoverable && !faded,
      'hover:shadow-card': hoverable && faded,
      'bg-white shadow-card': !faded,
      'bg-gray-100 shadow-card-sm': faded,
    }"
  >
    <div :class="twMerge('p-3', contentClass)">
      <slot />
    </div>
  </div>
</template>
