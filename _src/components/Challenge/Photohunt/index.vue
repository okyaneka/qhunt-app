<script setup lang="ts">
import dayjs from "dayjs";
import type { UserChallengeResult, UserPhotoHunt } from "qhunt-lib";
import { common } from "~/_src/helpers";
import { namespace, useSocket } from "~/_src/helpers/socket";
import { push } from "~/_src/helpers/toast";

interface Feedback {
  status: string;
  message: string;
}

interface Props {
  id: string;
}

interface Emits {
  (e: "finish"): void;
}

const lang: any = {
  "photohunt.not_found": "Ups, objek ini salah. Cek petunjuknya lagi yuk!",
  "user_photohunt.not_found": "Bukan yang ini! Cek kembali petunjuknya ya!",
  "user_photohunt.submitted":
    "Sepertinya, Kamu sudah menemukan ini sebelumnya. Yuk cari yang lain!",
};
const { id } = defineProps<Partial<Props>>();

const emit = defineEmits<Emits>();

const timer = ref(0);
const showFeedback = ref(false);
const feedback = ref<Feedback>();
const items = ref<UserPhotoHunt[]>();
const results = ref<UserChallengeResult>();

const socketParams = computed(() => ({ id: id }));

const progress = computed(() =>
  (items.value || []).reduce(
    (acc, cur) => {
      acc[cur.results ? "found" : "remaining"] += 1;
      return acc;
    },
    { found: 0, remaining: 0 }
  )
);

const {
  connect,
  socket: io,
  status,
} = useSocket(
  namespace.photohunt,
  {
    query: socketParams,
    reconnectionAttempts: 4,
    manual: true,
  },
  (io) => {
    io.on("error", (message) => {
      connect();
    });

    io.on("setItems", (value: UserPhotoHunt[]) => {
      items.value = value;
    });

    io.on("setResults", (value: UserChallengeResult, finish?: boolean) => {
      if (finish) emit("finish");
      results.value = value;
    });

    io.on("setTimer", (value: number) => {
      timer.value = value;
    });
  }
);

const onScanned = (value: string) => {
  io.value?.emit("check", value, (res: Feedback) => {
    showFeedback.value = true;
    feedback.value = res;
  });
};

watch(
  socketParams,
  (val) => {
    if (val.id) connect();
  },
  { immediate: true, deep: true }
);

onMounted(() => {});

onUnmounted(() => {
  io.value?.disconnect();
});
</script>

<template>
  <CQrScanner
    v-slot="{ toggleTorch, isTorchOn, torchSupport }"
    class="h-screen absolute top-0 left-0 w-full"
    hide-flashlight
    :disabled="showFeedback || status == 'disconnected'"
    @scanned="onScanned"
  >
    <div v-if="status == 'disconnected'" class="h-full w-full flex">
      <CCard class="m-auto" content-class="text-center">
        <div class="text-center mb-2">
          Terjadi kesalahan saat menghubungkan ke server
        </div>
        <div class="flex justify-center gap-2">
          <CButton color="light" variant="light" size="sm" as="link" :to="'/'"
            >Kembali</CButton
          >
          <CButton color="light" size="sm" @click="connect">Coba Lagi</CButton>
        </div>
      </CCard>
    </div>

    <div v-else class="flex flex-col gap-4 p-4 h-full w-full relative">
      <div
        v-if="showFeedback && feedback"
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full p-4 flex justify-center"
      >
        <CCard class="max-w-full w-80" content-class="flex flex-col gap-2">
          <div>
            <div class="flex justify-center">
              <Icon
                v-if="feedback.status == 'success'"
                class="text-green-500"
                name="ri:check-line"
                size="48"
              />
              <Icon
                v-else
                class="text-red-500"
                name="ri:close-line"
                size="48"
              />
            </div>

            <div class="text-xl font-bold text-center">
              {{ lang[feedback.message] || feedback.message }}
            </div>
          </div>

          <div class="text-center mt-4">
            <CButton color="light" @click="showFeedback = false"
              >Cari Lagi!</CButton
            >
          </div>
        </CCard>
      </div>

      <div class="flex justify-center">
        <div class="local-card px-2 py-1 text-xl font-semibold text-white">
          <span :class="{ 'text-red-400 animate-pulse': timer <= 30 }">
            {{ dayjs(timer * 1e3).format("mm:ss") }}
          </span>
        </div>
      </div>

      <div
        class="flex flex-col items-end gap-2 min-w-44 cursor-pointer"
        @click="
          showFeedback = !showFeedback;
          connect();
        "
      >
        <div class="local-card p-2">
          <table class="w-full border-collapse">
            <tbody>
              <tr>
                <td class="pr-2">Objek Ditemukan</td>
                <td class="text-right">{{ progress.found }}</td>
              </tr>
              <tr class="pb-2">
                <td class="pr-2">Sisa Objek</td>
                <td class="text-right">{{ progress.remaining }}</td>
              </tr>
              <tr class="text-2xl pt-2 font-semibold">
                <td colspan="2">
                  <div class="flex items-center gap-2 justify-between">
                    <span> Skor </span>
                    <div class="flex gap-1 items-center">
                      <Transition name="move-out" mode="out-in">
                        <span
                          class="min-w-12 text-right"
                          :key="results?.baseScore"
                        >
                          {{ results?.baseScore || 0 }}
                        </span>
                      </Transition>
                      <Icon
                        class="text-yellow-600"
                        name="ri:copper-coin-fill"
                      />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex gap-2">
          <CButton
            v-if="torchSupport"
            :class="{
              'bg-opacity-50': !isTorchOn,
              'bg-white !text-dark': isTorchOn,
            }"
            size="sm"
            icon
            @click="toggleTorch"
          >
            <Icon
              :name="isTorchOn ? 'ri:flashlight-fill' : 'ri:flashlight-line'"
            />
          </CButton>
        </div>
      </div>

      <div
        class="local-card absolute right-4 bottom-4 flex flex-col gap-1 py-2 max-w-56"
      >
        <div class="px-2 top-0 font-semibold">Petunjuk</div>
        <div class="px-2 max-h-60 overflow-auto">
          <table class="w-full border-collapse">
            <tbody>
              <tr
                v-for="(item, i) in items"
                :key="item.id"
                class="text-white"
                :class="{ 'text-opacity-70': item.results }"
              >
                <td class="pr-1 w-0 align-top">{{ i + 1 }}.</td>
                <td :class="{ 'line-through': item.results }">
                  {{ item.photoHunt.hint }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </CQrScanner>
</template>

<style scoped>
.local-card {
  @apply border border-dark-600 bg-dark bg-opacity-60 text-white;
}
</style>
