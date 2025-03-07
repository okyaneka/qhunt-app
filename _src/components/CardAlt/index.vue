<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import type { HTMLAttributes } from "vue";
import { RouterLink, type RouteLocationRaw } from "vue-router";

type Props = {
  decoration: boolean;
  flat: boolean;
  dark: boolean;
  faded: boolean;
  hoverable: boolean;
  contentClass: HTMLAttributes["class"];
  to: RouteLocationRaw;
};

useAttrs();

const { to, hoverable, contentClass } = defineProps<Partial<Props>>();

const isHoverable = computed(() => hoverable || to);
</script>

<template>
  <component
    :is="to ? RouterLink : 'div'"
    class="card rounded-lg overflow-clip block"
    :to="to"
    :class="{
      border: flat,
      decoration: decoration,
      'cursor-pointer transition-all hover:z-[9999]': isHoverable,
      'hover:shadow-card-lg': isHoverable && !faded && !flat,
      'hover:shadow-card': isHoverable && faded && !flat,
      'hover:bg-gray-50': isHoverable && !faded && flat,
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
  </component>
</template>
