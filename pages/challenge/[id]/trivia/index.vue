<script setup lang="ts">
import type { UserChallengeResult, UserTrivia } from "qhunt-lib";
import { common, routes, socket } from "~/_src/helpers";
import { challenge } from "~/_src/services";

definePageMeta({ layout: "blank" });

const route = useRoute();

const id = computed(() => route.params.id as string);

const { data } = challenge.detail(id);
const detail = computed(() => data.value?.data);

const trivia = ref<UserTrivia>();

const {
  connect,
  socket: io,
  ping,
  status,
} = socket.useSocket(
  socket.trivia,
  {
    query: { id: id.value },
    reconnectionAttempts: 4,
    ping: true,
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
      confetti.value = !hasFinish;
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

const setAnswer = (value?: string) => {
  io.value?.emit("setAnswer", value);
};

const result = ref<UserChallengeResult>();
const progress = ref("");
const timer = ref(0);
const score = ref(0);
const isFinnish = ref(false);
const isShowFeedback = ref(false);
const confetti = ref(false);
const feedback = ref("");

onMounted(() => {
  connect();
});

onUnmounted(() => {
  io.value?.disconnect();
});
</script>

<template>
  <div class="flex flex-col gap-4 min-h-[calc(100vh-24px)]">
    <div v-if="status == 'connected'" class="my-auto">
      <div v-if="!result" class="flex gap-4 items-center">
        <div>{{ ping }}ms</div>
      </div>
      <CChallengeResults
        v-if="isFinnish && result"
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
        <div class="text-center mb-2">Tidak dapat menghubungkan ke server</div>
        <div class="flex justify-center gap-2">
          <CButton
            color="light"
            variant="light"
            size="sm"
            as="link"
            :to="routes.stage.challenges(String(detail?.userStage?.id))"
            >Kembali</CButton
          >
          <CButton color="light" size="sm" @click="io?.connect()"
            >Coba Lagi</CButton
          >
        </div>
      </CCard>
    </div>
  </div>
</template>
