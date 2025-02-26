<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import type { HTMLAttributes } from "vue";

type Props = {
  flat: boolean;
  dark: boolean;
  faded: boolean;
  hoverable: boolean;
  contentClass: HTMLAttributes["class"];
};

useAttrs();

const { hoverable, contentClass } = defineProps<Partial<Props>>();
</script>

<template>
  <div
    class="card rounded-lg overflow-clip"
    :class="{
      border: flat,
      'cursor-pointer transition-all hover:z-[9999]': hoverable,
      'hover:shadow-card-lg': hoverable && !faded && !flat,
      'hover:shadow-card': hoverable && faded && !flat,
      'text-white': dark,
      'bg-dark': dark && !faded,
      'bg-dark-700': dark && faded,
      'bg-white': !dark && !faded,
      'bg-gray-100 ': !dark && faded,
      'shadow-card': !faded && !flat,
      'shadow-card-sm': faded && !flat,
    }"
  >
    <div :class="twMerge('p-3', contentClass)">
      <slot />
    </div>
  </div>
</template>
