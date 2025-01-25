<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import { common } from "~/_src/helpers";

useAttrs();
const { guides = false, content } = defineProps<{
  content: string;
  guides?: boolean;
}>();

const emit = defineEmits<{ (e: "click:finish"): void; (e: "finish"): void }>();

const contentRef = ref<HTMLDivElement>();
const chunk = computed(() => common.split(content, 4));
const index = ref(0);
const text = ref("");
const isWriting = ref(false);
const timeout = ref();

const scrollDown = () => {
  if (contentRef.value)
    contentRef.value.scrollTo({
      top: contentRef.value.scrollHeight,
      behavior: "smooth",
    });
};

const resetWriting = () => {
  isWriting.value = false;
  index.value = 0;
  clearTimeout(timeout.value);
};

const writing = () => {
  isWriting.value = true;
  text.value += chunk.value[index.value];
  if (index.value + 1 < chunk.value.length) {
    index.value++;
    timeout.value = setTimeout(() => {
      isWriting.value = false;
      writing();
    }, 75);
  } else {
    emit("finish");
    resetWriting();
  }

  nextTick().then(() => {
    scrollDown();
  });
};

const handleClick = () => {
  if (isWriting.value) {
    text.value += chunk.value.slice(index.value).join("");
    resetWriting();
  } else {
    emit("click:finish");
  }
};

watch(chunk, () => {
  text.value = "";
  writing();
});

onMounted(() => {
  writing();
});
</script>

<template>
  <div @click="handleClick" class="h-full select-none">
    <div
      ref="contentRef"
      class="story-typing h-full overflow-auto"
      v-html="text"
    ></div>

    <div v-if="guides" class="text-center text-gray-300 mt-2 text-base">
      Sentuh untuk melanjutkan...
    </div>
  </div>
</template>
