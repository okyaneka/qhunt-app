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
const boundary = computed(() => {
  return {
    x: 8,
    y: 8,
    width: (document?.documentElement.clientWidth || 0) - 16,
    height: (document?.documentElement.clientHeight || 0) - 16,
  };
});

const { floatingStyles } = useFloating(elRef, contentRef, {
  strategy: "fixed",

  middleware: [
    offset({
      mainAxis: 4,
    }),
    flip({
      padding: 2,
      boundary: boundary.value,
    }),
    shift({
      padding: 2,
      boundary: boundary.value,
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
  <ClientOnly>
    <div ref="targetRef" @mouseenter="show(true)" @mouseleave="show(false)">
      <div ref="elRef">
        <slot />
      </div>

      <Transition name="fade-quick">
        <CCardAlt v-if="isVisible" ref="contentRef" :style="floatingStyles">
          <slot name="content" />
        </CCardAlt>
      </Transition>
    </div>
  </ClientOnly>
</template>
