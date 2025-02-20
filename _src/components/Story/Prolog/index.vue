<script setup lang="ts">
import { common } from "~/_src/helpers";

const props = defineProps<{ storyline: string[] }>();

const emit = defineEmits<{
  (e: "click:finish"): void;
}>();

const timeout = ref();
const index = ref(-1);
const isTelling = ref(true);

const line = computed(() => props.storyline[index.value]);

const telling = () => {
  if (index.value == props.storyline.length - 1) {
    isTelling.value = false;
    return emit("click:finish");
  }

  clearTimeout(timeout.value);
  isTelling.value = true;
  index.value++;
  timeout.value = setTimeout(() => {
    if (index.value < props.storyline.length) telling();
    else isTelling.value = false;
  }, common.wpm(line.value));
  // if (isTelling.value)
};

onMounted(() => {
  telling();
});
</script>

<template>
  <div
    class="story-prolog flex h-screen w-screen bg-black text-white fixed top-0 left-0"
    @click="telling"
  >
    <div class="w-lg-center h-full w-full relative">
      <Transition mode="out-in">
        <div
          class="p-4 h-full flex flex-col items-center justify-center select-none"
          :key="line"
        >
          <div class="text-4xl text-center">
            {{ line }}
          </div>
        </div>
      </Transition>

      <div class="absolute bottom-4 w-full">
        <Transition>
          <div v-if="!isTelling" class="animate-bounce text-center">👇</div>
        </Transition>
        <div class="text-center text-gray-500">Sentuh untuk melanjutkan...</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  @apply transition-opacity duration-500;
}

.v-enter-from,
.v-leave-to {
  @apply opacity-0;
}
</style>
