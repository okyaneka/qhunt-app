<script setup lang="ts">
import dayjs from "dayjs";
import type { UserChallengeResult } from "qhunt-lib/models/UserChallengeModel";
import { common, routes, socket } from "~/_src/helpers";
import type { UserTrivia } from "qhunt-lib/models/UserTriviaModel";
import { challenge } from "~/_src/services";

definePageMeta({ layout: "blank" });

const route = useRoute();

const id = computed(() => route.params.id as string);

const { data, refetch } = challenge.detail(id);
const detail = computed(() => data.value?.data);

const trivia = ref<UserTrivia>();

const {
  socket: io,
  ping,
  status,
} = socket.useSocket(
  socket.challenge,
  { query: { id: id.value }, reconnectionAttempts: 4, ping: true },
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

    io.on("setResult", (value: UserChallengeResult, withDuar?: boolean) => {
      if (withDuar) common.duar();
      isFinnish.value = true;
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

const setAnswer = () => {
  io.value?.emit("setAnswer", selected.value);
};

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
const feedback = ref("");
const position = ref({ top: 0, left: 0 });

const timerLabel = computed(() => dayjs(timer.value * 1e3).format("mm:ss"));

const handleDouble = (e: MouseEvent, value: string) => {
  if (timeout.value) {
    setAnswer();
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

onMounted(() => {
  refetch();
});

onUnmounted(() => {
  io.value?.disconnect();
});
</script>

<template>
  <div class="flex flex-col gap-4 min-h-[calc(100vh-24px)]">
    <div v-if="status == 'connected'" class="my-auto">
      <div
        v-if="status === 'connected' && !result"
        class="flex gap-4 items-center"
      >
        <div>{{ ping }}ms</div>
      </div>
      <Transition name="fade" mode="out-in">
        <CCard v-if="isFinnish && result" content-class="flex flex-col gap-2">
          <div>
            <div class="text-4xl font-bold text-center">Selamat</div>
            <div class="text text-center">Kamu berhasil mengumpulkan</div>
            <div class="text-6xl font-bold text-center">
              <CAnimeCount
                :value="result.totalScore"
                :duration="8e2"
                @finish="isAh = true"
              />
              <!-- {{ score }} -->
            </div>
            <div class="text-xl text-center">poin</div>
          </div>
          <Transition name="fade-up">
            <div v-if="isAh" class="flex justify-center">
              <div class="bg-light bg-opacity-10 p-1">
                <table>
                  <tbody>
                    <tr>
                      <td class="pr-4">Jawaban benar</td>
                      <td>{{ result.correctCount }}</td>
                      <td>x</td>
                      <td class="text-right">
                        {{
                          result.correctCount != 0
                            ? result.baseScore / result.correctCount
                            : 0
                        }}
                      </td>
                    </tr>
                    <tr>
                      <td class="pr-4">Bonus Jawaban Benar</td>
                      <td>1</td>
                      <td>x</td>
                      <td class="text-right">{{ result.correctBonus }}</td>
                    </tr>
                    <tr>
                      <td class="pr-4">Bonus Waktu</td>
                      <td>1</td>
                      <td>x</td>
                      <td class="text-right">{{ result.bonus }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Transition>
          <Transition name="fade-up">
            <div v-if="isAh" class="text-center mt-4 delay-300">
              <CButton
                as="link"
                :to="routes.stage.challenges(String(detail?.userStage?.id))"
                variant="light"
                color="light"
                >Kembali</CButton
              >
            </div>
          </Transition>
        </CCard>

        <div v-else-if="trivia" class="flex flex-col gap-2">
          <div class="flex justify-between items-center relative text-xl">
            <div>{{ progress }}</div>
            <div class="absolute left-1/2 -translate-x-1/2">
              {{ timerLabel }}
            </div>
            <div class="flex items-center gap-1">
              <Icon class="text-yellow-600" name="ri:copper-coin-fill" />
              <Transition name="move-out" mode="out-in">
                <span :key="score" @click="score += 100">
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
    </div>

    <div v-else-if="status == 'connecting'" class="m-auto">
      <CLoader>Menghubungkan...</CLoader>
    </div>

    <div v-else-if="status == 'disconnected'" class="m-auto">
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

    <CAnimeSplashOut
      v-model:show="isShowFeedback"
      class="fixed -translate-x-1/2 -translate-y-1/2 origin-top-left"
      :style="{ left: position.left + 'px', top: position.top + 'px' }"
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
