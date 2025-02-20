<script setup lang="ts">
import type { LeaderboardData } from "qhunt-lib";
import { routes } from "~/_src/helpers";
import { namespace, useSocket } from "~/_src/helpers/socket";
import { stage } from "~/_src/services";
import useAuthStore from "~/_src/stores/auth";

definePageMeta({ layout: "mobile" });

const authStore = useAuthStore();
const route = useRoute();
const { auth } = authStore;

const leaderboard = ref<LeaderboardData>();
const ranks = computed(
  () =>
    leaderboard.value?.ranks.map((v) => ({ ...v, key: v.userPublic.id })) || []
);

const id = computed(() => route.params.id as string);

const { data, isLoading, refetch: getDetail } = stage.detail(id);

const detail = computed(() => data.value?.data);

const socketParams = computed(() => ({
  stageId: detail.value?.stage.id,
  mode: "ranks",
}));

const { socket, connect } = useSocket(
  namespace.leaderboard,
  {
    query: socketParams,
    reconnectionAttempts: 4,
    manual: true,
  },
  (io) => {
    io.on("setData", (data: LeaderboardData) => {
      leaderboard.value = data;
    });
  }
);

const onEnter = (el: Element) => {
  const item = el as HTMLElement;
  const index = item.dataset.index;
  item.style.transitionDelay = `${50 * (Number(index) || 0)}ms`;
};

const onAfterEnter = (el: Element) => {
  const item = el as HTMLElement;
  item.style.transitionDelay = "0ms";
};

onMounted(() => {
  connect();
});

onUnmounted(() => {
  socket.value?.disconnect();
  // leaderboard.value = undefined;
});
</script>

<template>
  <div
    v-if="isLoading"
    class="p-4 flex h-[calc(100vh-24px)] justify-center items-center"
  >
    <CLoader />
  </div>

  <div v-else class="flex flex-col">
    <CBarTitle :back="routes.stage.challenges(id)">
      Ranking {{ detail?.stage.name }}
    </CBarTitle>

    <CTransitionPullIn
      class="p-3"
      :items="ranks"
      item-key="key"
      v-slot="{ item }"
    >
      <CCardAlt class="mb-2" content-class="flex items-center justify-between">
        <div>
          <div class="text-2xl font-semibold">
            #{{ item.rank }}

            <span class="">
              {{ item.userPublic.name }}
            </span>
            <span
              v-if="item.userPublic.id === auth?.id"
              class="text-lg text-gray-400 font-normal"
            >
              (saya)
            </span>
          </div>
          <div class="font-sans text-xs text-gray-400 uppercase">
            USER ID:
            {{ item.userPublic.code.slice(0, 8) }}
          </div>
        </div>
        <div class="flex items-center gap-1">
          <Icon class="text-yellow-600 text-2xl" name="ri:copper-coin-fill" />

          <Transition name="move-out" mode="out-in">
            <div :key="item.totalScore" class="text-2xl">
              {{ item.totalScore }}
            </div>
          </Transition>
        </div>
      </CCardAlt>
    </CTransitionPullIn>
  </div>
</template>

<style scoped>
.v-move,
.v-enter-active,
.v-leave-active {
  @apply transition-all ease-out duration-500;
}
.v-leave-active {
  @apply absolute w-full;
}
.v-enter-from,
.v-leave-to {
  @apply opacity-0 translate-x-1/3;
}

.move-out-enter-active,
.move-out-leave-active {
  @apply transition-all duration-150 ease-in;
}

.move-out-enter-from {
  @apply translate-y-full;
}

.move-out-leave-to {
  @apply -translate-y-full;
}

.move-out-enter-from,
.move-out-leave-to {
  @apply opacity-0;
}
</style>
