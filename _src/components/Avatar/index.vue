<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import type { HTMLAttributes } from "vue";

type Props = {
  src: string;
};

const attrs = useAttrs() as HTMLAttributes;

const { src } = defineProps<Partial<Props>>();

const isCrashed = ref(false);
</script>

<template>
  <div
    :class="`${twMerge(
      'h-36 w-36 rounded-full flex bg-light-50 overflow-clip relative',
      attrs.onClick ? 'cursor-pointer' : '',
      attrs.class
    )}`"
  >
    <Transition name="fade-quick" mode="out-in">
      <img
        v-if="src && !isCrashed"
        class="object-cover w-full h-full"
        :src="src"
        @error="isCrashed = true"
      />
      <Icon
        v-else
        class="w-3/4 h-3/4 m-auto"
        name="twemoji:front-facing-baby-chick"
      />
    </Transition>
  </div>
</template>
