<script setup lang="ts">
import type { LeaderboardData } from "qhunt-lib";
import { request, routes } from "~/_src/helpers";
import { namespace, useSocket } from "~/_src/helpers/socket";
import { stage } from "~/_src/services";
import AuthService from "~/_src/services/auth";
import useAuthStore from "~/_src/stores/auth";
import type { RendererElement } from "vue";

definePageMeta({ layout: "mobile" });

const authStore = useAuthStore();
const route = useRoute();
const { auth } = authStore;

const leaderboard = ref<LeaderboardData>();
const ranks = computed(() => leaderboard.value?.ranks || []);

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
  },
  (io) => {
    io.on("setData", (data: LeaderboardData) => {
      setTimeout(() => {
        leaderboard.value = data;
      }, 0);
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

    <TransitionGroup
      tag="div"
      class="relative p-3 overflow-visible"
      @enter="onEnter"
      @after-enter="onAfterEnter"
    >
      <CCard
        v-for="(item, i) in ranks"
        :key="item.userPublic.code"
        class="mb-1"
        content-class="flex items-center justify-between"
        :style="{ zIndex: ranks.length - i }"
        :data-index="i"
      >
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
              (kamu)
            </span>
          </div>
          <div class="font-sans text-xs text-gray-300 uppercase">
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
      </CCard>
    </TransitionGroup>
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
