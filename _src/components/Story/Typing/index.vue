<script setup lang="ts">
import { common } from "~/_src/helpers";

useAttrs();
const {
  guides = false,
  content,
  wpm = 300,
} = defineProps<{
  content: string;
  wpm?: number;
  guides?: boolean;
}>();

const emit = defineEmits<{ (e: "click:finish"): void; (e: "finish"): void }>();

const contentRef = ref<HTMLDivElement>();
const chunk = ref(2);
const index = ref(-2);
const isWriting = ref(false);
const timeout = ref();

const chunks = computed(() => common.split(content, chunk.value));

const speed = computed(() => {
  const div = document.createElement("div");
  div.innerHTML = content;

  const text = div.textContent || "";
  const speed =
    common.wpm(text, { speed: wpm, buffer: 0 }) / chunks.value.length;
  if (speed < 75) chunk.value += 1;

  return speed;
});

const scrollDown = () => {
  if (contentRef.value)
    contentRef.value.scrollTo({
      top: contentRef.value.scrollHeight,
      behavior: "smooth",
    });
};

const resetWriting = () => {
  isWriting.value = false;
  clearTimeout(timeout.value);
};

const writing = () => {
  isWriting.value = true;
  if (index.value + 1 < chunks.value.length) {
    index.value++;
    timeout.value = setTimeout(() => {
      isWriting.value = false;
      writing();
    }, speed.value);
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
    index.value = chunks.value.length - 1;
    resetWriting();
  } else {
    emit("click:finish");
  }
};

watch(chunks, () => {
  index.value = -2;
  writing();
});

onMounted(() => {
  writing();
});
</script>

<template>
  <div @click="handleClick" class="h-full select-none">
    <div ref="contentRef" class="story-typing h-full overflow-auto">
      <span
        v-for="(chunk, i) in chunks"
        v-text="chunk"
        :class="index < i ? 'opacity-0' : 'opacity-100'"
      />
    </div>

    <div v-if="guides" class="text-center text-gray-300 mt-2 text-base">
      Sentuh untuk melanjutkan...
    </div>
  </div>
</template>
