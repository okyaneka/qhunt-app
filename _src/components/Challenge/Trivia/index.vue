<script setup lang="ts">
import dayjs from "dayjs";
import type { UserTrivia } from "qhunt-lib";

interface Props {
  trivia: UserTrivia;
  progress: string;
  timer: number;
  score: number;
  feedback: string;
  showFeedback: boolean;
}

interface Emits {
  (e: "answer", value?: string): void;
  (e: "update:showFeedback", value: boolean): void;
}

const {
  trivia,
  progress = "",
  timer = 0,
  score = 0,
  feedback = "",
  showFeedback = false,
} = defineProps<Partial<Props>>();

const emits = defineEmits<Emits>();

const timeout = ref();
const isShowOption = ref(false);
const selected = ref<string>();
const position = ref({ top: 0, left: 0 });

const timerLabel = computed(() => dayjs(timer * 1e3).format("mm:ss"));

const handleDouble = (e: MouseEvent, value: string) => {
  if (timeout.value) {
    emits("answer", selected.value);
    position.value = { top: e.clientY - 40, left: e.clientX };
    isShowOption.value = false;
    selected.value = undefined;
    resetState();
  } else {
    selected.value = value;
    timeout.value = setTimeout(() => {
      resetState();
    }, 3e2);
  }
};

const resetState = () => {
  clearTimeout(timeout.value);
  timeout.value = undefined;
};
</script>

<template>
  <Transition name="fade" mode="out-in">
    <div v-if="trivia" class="flex flex-col gap-2">
      <div class="flex justify-between items-center relative text-xl">
        <div>{{ progress }}</div>
        <div class="absolute left-1/2 -translate-x-1/2">
          {{ timerLabel }}
        </div>
        <div class="flex items-center gap-1">
          <Icon class="text-yellow-600" name="ri:copper-coin-fill" />
          <Transition name="move-out" mode="out-in">
            <span :key="score">
              {{ score }}
            </span>
          </Transition>
        </div>
      </div>

      <CCard content-class="flex flex-col gap-4 min-h-56">
        <CStoryTyping
          class="text-center text-xl"
          :content="trivia.trivia.question"
          @finish="isShowOption = true"
        />

        <Transition name="fade-up">
          <div v-if="isShowOption" class="flex flex-col gap-2 my-auto">
            <CButton
              v-for="item in trivia.trivia.options"
              :key="item.text"
              class="block"
              :variant="selected == item.text ? 'default' : 'light'"
              color="light"
              @click="handleDouble($event, item.text)"
            >
              {{ item.text }}</CButton
            >
          </div>
        </Transition>

        <div class="text-center text-gray-500 mt-auto">
          Ketuk 2x untuk memilih dan melanjutkan...
        </div>
      </CCard>
    </div>
  </Transition>

  <CAnimeSplashOut
    :show="showFeedback"
    @update:show="emits('update:showFeedback', $event)"
    class="fixed -translate-x-1/2 -translate-y-1/2 origin-top-left"
    :style="{ left: position.left + 'px', top: position.top + 'px' }"
  >
    <div class="text-xl p-2 px-4 bg-light rounded select-none">
      {{ feedback }}
    </div>
  </CAnimeSplashOut>
</template>

<style scoped>
.move-out-enter-active,
.move-out-leave-active {
  @apply transition-all duration-150 ease-in;
}

.move-out-enter-from {
  @apply translate-y-4;
}

.move-out-leave-to {
  @apply -translate-y-4;
}

.move-out-enter-from,
.move-out-leave-to {
  @apply opacity-0;
}
</style>
