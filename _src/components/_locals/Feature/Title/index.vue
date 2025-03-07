<script setup lang="ts">
import type { Breadcrumb } from "~/_src/components/Breadcrumb/index.vue";

type Props = {
  title: string;
  breadcrumb: Breadcrumb[];
};

const { title, breadcrumb } = defineProps<Partial<Props>>();
</script>

<template>
  <div>
    <CBreadcrumb v-if="breadcrumb" class="mb-2" :breadcrumb="breadcrumb" />
    <slot v-if="$slots.default" />
    <h1 v-else>{{ title || "Judul" }}</h1>
  </div>
</template>
