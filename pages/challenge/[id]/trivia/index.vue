<script setup lang="ts">
import { io as p } from "socket.io-client";
import type { UserChallengeResult, UserTrivia } from "qhunt-lib";
import { common, routes, socket, toast } from "~/_src/helpers";
import { challenge } from "~/_src/services";
import { useEnv } from "~/_src/configs/env";

definePageMeta({ layout: "blank" });

const route = useRoute();

const trivia = ref<UserTrivia>();

const id = computed(() => route.params.id as string);
const { data } = challenge.detail(id);
const detail = computed(() => data.value?.data);

const socketParams = computed(() => ({
  id: detail.value?.id,
}));

const {
  connect,
  socket: io,
  ping,
  status,
} = socket.useSocket(
  socket.trivia,
  {
    query: socketParams,
    reconnectionAttempts: 4,
    ping: detail.value?.status !== "completed",
  },
  (io) => {
    /**
     * events
     * 1. setQuestion
     * 2. setFeedback
     * 3. setResult
     * 4. setScore
     * 5. setTimer
     * 6. setProgress
     */

    io.on("setQuestion", (value: UserTrivia) => {
      trivia.value = value;
    });

    io.on("setFeedback", (value: string) => {
      isShowFeedback.value = true;
      feedback.value = value;
    });

    io.on("setResult", (value: UserChallengeResult, hasFinish?: boolean) => {
      if (hasFinish) common.duar();
      confetti.value = hasFinish;
      isFinnish.value = true;
      trivia.value = undefined;
      result.value = value;
    });

    io.on("setScore", (value: number) => {
      score.value = value;
    });

    io.on("setTimer", (value: number) => {
      timer.value = value;
    });

    io.on("setProgress", (value: string) => {
      progress.value = value;
    });
  }
);

// io.value?.on("error", () => {
//   connect();
// });

const setAnswer = (value?: string) => {
  io.value?.emit("setAnswer", value);
};

const result = ref<UserChallengeResult>();
const progress = ref("");
const timer = ref(0);
const score = ref(0);
const isFinnish = ref(false);
const isShowFeedback = ref(false);
const confetti = ref<boolean>();
const feedback = ref("");

onMounted(() => {
  connect();
});

onUnmounted(() => {
  io.value?.disconnect();
});
</script>

<template>
  <div class="flex flex-col gap-4 min-h-[calc(100vh)] p-3">
    <div v-if="status == 'connected'" class="my-auto">
      <div v-if="!result" class="flex gap-4 items-center">
        <div>{{ ping }}ms</div>
      </div>

      <CChallengeResults
        v-if="isFinnish && result"
        :animate="confetti"
        :results="result"
        :stageId="detail?.userStage?.id"
      />

      <CChallengeTrivia
        v-if="trivia"
        v-model:showFeedback="isShowFeedback"
        :trivia="trivia"
        :progress="progress"
        :timer="timer"
        :score="score"
        :feedback="feedback"
        @answer="setAnswer"
      />
    </div>

    <div v-else-if="status == 'connecting'" class="m-auto">
      <CLoader>Menghubungkan...</CLoader>
    </div>

    <div
      v-else-if="status == 'disconnected' && detail?.status !== 'completed'"
      class="m-auto"
    >
      <CCard content-class="text-center">
        <div class="text-center mb-2">
          Terjadi kesalahan saat menghubungkan ke server
        </div>
        <div class="flex justify-center gap-2">
          <CButton
            color="light"
            variant="light"
            size="sm"
            as="link"
            :to="routes.stage.challenges(String(detail?.userStage?.id))"
            >Kembali</CButton
          >
          <!-- <CButton color="light" size="sm" @click="io?.connect()"
            >Coba Lagi</CButton
          > -->
        </div>
      </CCard>
    </div>
  </div>
</template>
