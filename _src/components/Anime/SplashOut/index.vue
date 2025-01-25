<script setup lang="ts">
const { show } = defineProps<{ show: boolean }>();

useAttrs();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
}>();

const afterEnter = () => {
  emit("update:show", false);
};
</script>

<template>
  <Transition name="splash-out" @after-enter="afterEnter">
    <div v-if="show" class="-translate-y-4">
      <slot />
    </div>
  </Transition>
</template>

<style scoped>
.splash-out-enter-active {
  @apply transition-all duration-100;
}
.splash-out-leave-active {
  @apply transition-all duration-700;
}
.splash-out-enter-from {
  @apply opacity-0 translate-y-0;
}
.splash-out-enter-to,
.splash-out-leave-from {
  @apply opacity-100 -translate-y-4;
}
.splash-out-leave-to {
  @apply opacity-0 -translate-y-10;
}
</style>
