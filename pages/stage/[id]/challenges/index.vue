<script setup lang="ts">
import { USER_CHALLENGE_STATUS } from "qhunt-lib/types";
import type { LeaderboardData, UserChallengeParams } from "qhunt-lib";
import { common, routes } from "~/_src/helpers";
import { stage, challenge } from "~/_src/services";
import { namespace, useSocket } from "~/_src/helpers/socket";

definePageMeta({
  layout: "mobile",
});

const route = useRoute();
const router = useRouter();

const id = computed(() => route.params.id as string);

const challengeParams = ref<Partial<UserChallengeParams>>({
  userStageId: id.value,
});

const { data, isLoading: detailLoading, refetch: getDetail } = stage.detail(id);
const {
  data: challengesData,
  isLoading: challengeLoading,
  refetch: getChallengeList,
} = challenge.list(challengeParams);

const detail = computed(() => data.value?.data);
const challenges = computed(() => challengesData.value?.data.list || []);

const socketParams = computed(() => ({
  stageId: detail.value?.stage.id,
  mode: "current",
}));

const leaderboard = ref<LeaderboardData>();

const { socket } = useSocket(
  namespace.leaderboard,
  {
    query: socketParams,
    reconnectionAttempts: 4,
  },
  (io) => {
    io.on("setData", (data: LeaderboardData) => {
      leaderboard.value = data;
    });
  }
);

onUnmounted(() => {
  socket.value?.disconnect();
});
</script>

<template>
  <div
    v-if="detailLoading || challengeLoading"
    class="p-4 flex h-[calc(100vh-24px)] justify-center items-center"
  >
    <CLoader />
  </div>

  <div v-else class="flex flex-col">
    <CBarTitle :back="routes.stage.index">
      {{ detail?.stage.name }}
    </CBarTitle>

    <div class="flex flex-col gap-2 p-3">
      <CCard
        v-if="detail?.results"
        content-class="flex gap-4 justify-between items-center"
      >
        <div class="">
          <div class="flex gap-1 items-end">
            <span class="text-4xl font-bold"
              >#{{ leaderboard?.ranks[0]?.rank || "-" }}</span
            >
            <span>/{{ leaderboard?.total || "-" }}</span>
          </div>
          <RouterLink :to="routes.stage.leaderboard(id)"
            >Lihat semua</RouterLink
          >
        </div>

        <div class="flex flex-col items-end">
          <div class="flex gap-1 text-3xl items-center">
            <Icon class="text-yellow-600" name="ri:copper-coin-fill" />
            {{ detail?.results?.totalScore }}
          </div>
        </div>
      </CCard>

      <CTransitionPullIn :items="challenges" item-key="id" v-slot="{ item }">
        <RouterLink
          class="mb-2 block"
          :to="
            (item.status == 'completed'
              ? routes.challenge.action
              : routes.challenge.prolog)(item.id)
          "
        >
          <CCardAlt
            hoverable
            :faded="item.status === USER_CHALLENGE_STATUS.Undiscovered"
            content-class="flex items-center justify-between"
          >
            <div>
              <div class="text-sm text-gray-600">
                #{{ item.challenge.order }}
                <span class="capitalize"> ({{ item.settings.type }}) </span>
              </div>
              <div class="text-lg">{{ item.challenge.name }}</div>
            </div>
            <div v-if="item.results" class="flex items-center gap-1">
              <Icon class="text-yellow-600" name="ri:copper-coin-fill" />

              <div class="text-xl">
                {{ item.results.totalScore }}
              </div>
            </div>

            <Icon
              v-else-if="item.status === USER_CHALLENGE_STATUS.Undiscovered"
              name="ri:spam-3-fill"
              class="text-gray-300"
              size="48"
            />
          </CCardAlt>
        </RouterLink>
      </CTransitionPullIn>
    </div>
  </div>
</template>
