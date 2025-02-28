<script setup lang="ts">
import { CSpinner } from "#components";
import axios from "axios";
import { twMerge } from "tailwind-merge";
import type { HTMLAttributes } from "vue";

type Props = {
  src: string | null;
  loading: boolean;
};

const attrs = useAttrs() as HTMLAttributes;

const { src } = defineProps<Partial<Props>>();

const isCrashed = ref(false);

const checkImage = () => {
  if (import.meta.server) return;
  if (src) {
    const img = new Image();
    img.src = src;
    img.onerror = () => (isCrashed.value = true);
    img.onload = () => (isCrashed.value = false);
    img.remove();
  }
};

watch(
  () => src,
  () => checkImage(),
  { immediate: true }
);
</script>

<template>
  <div
    :class="`${twMerge(
      'h-36 w-36 rounded-full flex bg-light-50 overflow-clip relative',
      attrs.onClick ? 'cursor-pointer' : '',
      attrs.class
    )}`"
  >
    <div
      v-if="loading"
      class="h-full w-full bg-black bg-opacity-20 flex absolute"
    >
      <CSpinner class="m-auto h-6 w-6" />
    </div>
    <Transition name="fade-quick" mode="out-in">
      <img
        v-if="src && !isCrashed"
        class="object-cover w-full h-full"
        :src="src.replaceAll(' ', '+')"
        alt="Avatar"
      />
      <Icon
        v-else
        class="w-3/4 h-3/4 m-auto"
        name="twemoji:front-facing-baby-chick"
      />
    </Transition>
  </div>
</template>
