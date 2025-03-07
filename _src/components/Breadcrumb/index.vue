<script setup lang="ts">
import { RouterLink } from "vue-router";

export type Breadcrumb = {
  title: string;
  href: string;
};

type Props = {
  breadcrumb: Breadcrumb[];
};

useAttrs();
const { breadcrumb } = defineProps<Props>();
</script>

<template>
  <div class="flex gap-2 text">
    <template v-for="(item, i) in breadcrumb" :key="item.href">
      <component
        class="capitalize"
        :is="i === breadcrumb.length - 1 ? 'span' : RouterLink"
        :to="item.href"
      >
        {{ item.title }}
      </component>
      <p v-if="i !== breadcrumb.length - 1">/</p>
    </template>
  </div>
</template>
