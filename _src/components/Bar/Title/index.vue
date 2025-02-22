<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

type Props = {
  back: RouteLocationRaw;
  icon: string;
  variant: "default" | "light" | "flat";
};

useAttrs();

const {
  back,
  icon = "ri:arrow-left-s-line",
  variant = "flat",
} = defineProps<Partial<Props>>();
</script>

<template>
  <div class="p-2">
    <div class="relative h-10 flex items-center justify-center">
      <div v-if="back" class="absolute left-0 top-1/2 -translate-y-1/2">
        <CButton icon :variant="variant" as="link" :to="back">
          <Icon :name="icon" size="24" />
        </CButton>
      </div>
      <h1 class="text-2xl text-center px-8">
        <slot />
      </h1>
    </div>
  </div>
</template>
