<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import type { HTMLAttributes } from "vue";

const attrs = useAttrs() as HTMLAttributes;
</script>

<template>
  <div
    :class="
      twMerge('skeleton min-h-4 w-full bg-gray-200 shimmer ', attrs.class || '')
    "
  ></div>
</template>
