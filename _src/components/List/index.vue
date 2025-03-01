<script setup lang="ts" generic="T">
import { twMerge } from "tailwind-merge";
import { RouterLink } from "vue-router";
import type { ListItem } from "~/_src/helpers";

type Props = {
  items: ListItem<T>[];
  itemKey: keyof T;
};

type Emits = {
  (e: "select", value: string): void;
};

const emit = defineEmits<Emits>();

useAttrs();

const { itemKey, items } = defineProps<Props>();
</script>

<template>
  <ul class="list flex flex-col gap-1 select-none">
    <li v-for="item in items" :key="String(item[itemKey])">
      <component
        :is="item.as === 'link' ? RouterLink : 'div'"
        :to="item.as === 'link' ? item.to : undefined"
        :role="item.as === 'link' ? 'link' : 'button'"
        :class="
          twMerge(
            'px-2 py-1 cursor-pointer rounded transition hover:bg-dark-50 ',
            item.class
          )
        "
        @click="emit('select', String(item[itemKey]))"
      >
        <slot :item />
      </component>
    </li>
  </ul>
</template>

<style scoped>
.list a {
  @apply block text-black hover:no-underline;
}
</style>
