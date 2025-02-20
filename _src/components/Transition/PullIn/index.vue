<script setup lang="ts" generic="T">
type Props = {
  items: T[];
  itemKey: keyof T;
};

const { items, itemKey } = defineProps<Props>();

const onEnter = (el: Element) => {
  const item = el as HTMLElement;
  const index = Number(item.dataset.index || 0);
  item.style.transitionDelay = `${50 * index}ms`;
};

const onAfterEnter = (el: Element) => {
  const item = el as HTMLElement;
  item.style.transitionDelay = "0ms";
};
</script>

<template>
  <TransitionGroup
    tag="div"
    class="relative"
    @enter="onEnter"
    @after-enter="onAfterEnter"
  >
    <div
      v-for="(item, i) in items"
      class="relative"
      :key="String(item[itemKey])"
      :data-index="i"
      :style="{ zIndex: items.length - i }"
    >
      <slot :item="item" />
    </div>
  </TransitionGroup>
</template>

<style scoped>
.v-move,
.v-enter-active,
.v-leave-active {
  @apply transition-all ease-in-out duration-300;
}
.v-leave-active {
  @apply absolute w-full;
}
.v-enter-from,
.v-leave-to {
  @apply opacity-0 translate-x-1/3;
}
</style>
