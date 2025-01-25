<script setup lang="ts">
import {
  flip,
  offset,
  shift,
  useFloating,
  detectOverflow,
  autoPlacement,
} from "@floating-ui/vue";

const elRef = ref();
const contentRef = ref();
const targetRef = ref();
const timeout = ref();

const isVisible = ref(false);

const { floatingStyles } = useFloating(elRef, contentRef, {
  strategy: "fixed",

  middleware: [
    offset({
      mainAxis: 16,
    }),
    flip({
      padding: 8,
      boundary: {
        x: 16,
        y: 16,
        width: document.documentElement.clientWidth - 32,
        height: document.documentElement.clientHeight - 32,
      },
    }),
    shift({
      padding: 8,
      boundary: {
        x: 16,
        y: 16,
        width: document.documentElement.clientWidth - 32,
        height: document.documentElement.clientHeight - 32,
      },
    }),
  ],
});

const show = (value: boolean = true) => {
  clearTimeout(timeout.value);
  timeout.value = setTimeout(
    () => {
      isVisible.value = value;
    },
    value ? 0 : 150
  );
};

onClickOutside(targetRef, (event) => (isVisible.value = false));
</script>

<template>
  <div ref="targetRef" @mouseenter="show(true)" @mouseleave="show(false)">
    <div ref="elRef" @touchend.prevent="show(!isVisible)" @touchstart.prevent>
      <slot />
    </div>
    <Transition>
      <div
        v-if="isVisible"
        ref="contentRef"
        class="bg-white bg-opacity-90 text-black rounded px-4 py-2 m-2 text-center"
        :style="floatingStyles"
      >
        <slot name="content" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  @apply transition-opacity duration-300;
}

.v-enter-from,
.v-leave-to {
  @apply opacity-0;
}
</style>
