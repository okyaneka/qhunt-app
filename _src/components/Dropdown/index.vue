<script setup lang="ts">
import {
  flip,
  offset,
  shift,
  useFloating,
  detectOverflow,
  autoPlacement,
  arrow,
} from "@floating-ui/vue";
import type { HTMLAttributes } from "vue";

type Emits = {
  (e: "select", value: string): void;
};

const emit = defineEmits<Emits>();

const triggerRef = ref();
const contentRef = ref();
const arrowRef = ref();
const targetRef = ref();
const timeout = ref();

const isVisible = ref(false);

const attrs = computed<HTMLAttributes>(() => ({
  onClick: () => {
    isVisible.value = !isVisible.value;
  },
}));

const boundary = computed(() => {
  return {
    x: 8,
    y: 8,
    width: (document?.documentElement.clientWidth || 0) - 16,
    height: (document?.documentElement.clientHeight || 0) - 16,
  };
});

const { floatingStyles, middlewareData } = useFloating(triggerRef, contentRef, {
  strategy: "fixed",

  middleware: [
    arrow({ element: arrowRef }),
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

const handleSelect = (value: string) => {
  isVisible.value = false;
  emit("select", value);
};

onClickOutside(
  triggerRef,
  (event) => {
    console.log(event);
    isVisible.value = false;
  },
  {
    ignore: [contentRef],
  }
);
</script>

<template>
  <ClientOnly>
    <div ref="triggerRef">
      <slot :attrs="attrs" />
    </div>

    <Teleport to="body">
      <Transition name="fade-quick">
        <div v-if="isVisible">
          <div
            ref="arrowRef"
            class="bg-red-400 w-2 h-2"
            :style="middlewareData.arrow"
          ></div>
          <CCardAlt
            v-if="isVisible"
            ref="contentRef"
            :style="floatingStyles"
            content-class="p-1.5 w-40 max-w-full"
          >
            <CList
              :items="[{ label: 'List item 3' }, { label: 'List item 2' }]"
              v-slot="{ item }"
              item-key="label"
              @select="handleSelect"
            >
              <div>{{ item.label }}</div>
            </CList>
            <!-- <div>{{ middlewareData.arrow }}</div> -->
            <slot name="content" />
          </CCardAlt>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>
