<script setup lang="ts" generic="T">
type Props = {
  items: T[];
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
  <ul class="flex flex-col gap-1 select-none">
    <li
      v-for="item in items"
      :key="String(item[itemKey])"
      class="px-2 py-1 cursor-pointer rounded transition hover:bg-dark-50"
      @click="emit('select', String(item[itemKey]))"
    >
      <slot :item />
    </li>
  </ul>
</template>
