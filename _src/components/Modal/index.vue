<script setup lang="ts">
import { CButton } from "#components";
import { twMerge } from "tailwind-merge";
import type { HTMLAttributes } from "vue";

interface Props {
  show: boolean;
  title: string;
  class: HTMLAttributes["class"];
}

type Emits = {
  (e: "update:show", value: boolean): void;
  (e: "open"): void;
  (e: "close"): void;
};

defineOptions({ inheritAttrs: false });

const { show = false, class: elClass } = defineProps<Partial<Props>>();

const emit = defineEmits<Emits>();

watch(
  () => show,
  (val) => {
    document.body.style.overflow = val ? "hidden" : "";
    val ? emit("open") : emit("close");
  }
);
</script>

<template>
  <Teleport to="body">
    <Transition name="fade-quick">
      <div
        v-if="show"
        class="fixed w-screen h-screen flex top-0 left-0 bg-black bg-opacity-50"
        @click="emit('update:show', false)"
      >
        <div class="max-w-full m-auto p-3">
          <CCardAlt
            :class="twMerge('w-96 max-w-full m-auto relative', elClass)"
            content-class="p-0 max-h-[calc(100vh-24px)] overflow-auto"
            @click.stop
          >
            <div class="absolute w-full left-0 top-0 flex p-1">
              <div class="flex ml-auto gap-1">
                <CButton
                  size="sm"
                  icon
                  variant="flat"
                  @click="emit('update:show', false)"
                >
                  <Icon name="ri:close-line" size="16" />
                </CButton>
              </div>
            </div>
            <div v-if="title" class="font-bold px-4 py-2 text-lg">
              {{ title }}
            </div>
            <div :class="{ 'px-4 pb-3': title, 'px-4 py-3': !title }">
              <slot />
            </div>
          </CCardAlt>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
