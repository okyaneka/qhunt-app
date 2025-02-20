<script setup lang="ts">
import { useToastProvider } from ".";

const { breads } = useToastProvider();
</script>

<template>
  <slot />

  <TransitionGroup
    tag="ul"
    class="fixed left-1/2 -translate-x-1/2 bottom-12 flex flex-col items-center gap-2 z-[9999]"
  >
    <li v-for="bread in breads" :key="bread.key" class="">
      <CChip
        v-if="typeof bread.message === 'string'"
        class="whitespace-nowrap"
        :type="bread.type"
        >{{ bread.message }}</CChip
      >
      <component v-else :is="bread.message" />
    </li>
  </TransitionGroup>
</template>

<style scoped>
.v-move,
.v-enter-active,
.v-leave-active {
  @apply transition-all ease-in-out duration-300;
}
.v-leave-active {
  @apply absolute;
}
.v-enter-from,
.v-leave-to {
  @apply opacity-0 translate-y-4;
}
</style>
