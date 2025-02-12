<script setup lang="ts">
import dayjs from "dayjs";
import type { UserChallengeResult, UserTrivia } from "qhunt-lib";
import { common, routes, socket } from "~/_src/helpers";
import { challenge } from "~/_src/services";

definePageMeta({ layout: "blank" });

const route = useRoute();

const id = computed(() => route.params.id as string);

const { data } = challenge.detail(id);
const detail = computed(() => data.value?.data);

const trivia = ref<UserTrivia>();

const timeout = ref();

const result = ref<UserChallengeResult>();
const progress = ref("");
const timer = ref(0);
const selected = ref<string>();
const score = ref(0);
const isFinnish = ref(false);
const isAh = ref(false);
const isShowOption = ref(false);
const isShowFeedback = ref(false);
const withDuar = ref(false);
const feedback = ref("");
const position = ref({ top: 0, left: 0 });
</script>

<template>
  <div class="flex flex-col gap-4 min-h-[calc(100vh-24px)]">
    <CAnimeSplashOut
      v-model:show="isShowFeedback"
      class="fixed -translate-x-1/2 -translate-y-1/2 origin-top-left left-1/2 top-12"
    >
      <div class="text-xl p-2 px-4 bg-light rounded select-none">
        {{ feedback }}
      </div>
    </CAnimeSplashOut>
  </div>
</template>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  @apply transition-all duration-300;
}

.fade-up-enter-from,
.fade-up-leave-to {
  @apply translate-y-4 opacity-0;
}

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
