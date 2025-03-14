<script setup lang="ts">
import type { LeaderboardData, UserChallengeParams } from "qhunt-lib";
import { common, routes } from "~/_src/helpers";
import { stage, challenge } from "~/_src/services";
import { namespace, useSocket } from "~/_src/helpers/socket";
import { USER_CHALLENGE_STATUS } from "qhunt-lib/constants";
import dayjs from "dayjs";
import { formatDate, setTitle } from "~/_src/helpers/common";

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

setTitle(`Challenges`);

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
    <CBarTitle :back="routes.stage.index"> Detail Quest </CBarTitle>

    <div class="flex flex-col gap-2 p-3">
      <CCardAlt
        flat
        class="decoration relative"
        content-class="flex flex-col gap-1"
      >
        <div class="absolute top-2 right-2">
          <CButton variant="light" color="light" size="sm">Bantuan</CButton>
        </div>
        <h2>{{ detail?.stage.name }}</h2>
        <div v-if="detail?.results">
          <CCardAlt flat class="inline-block" content-class="p-2">
            <div class="font-sans text-gray-500 text-xs font-semibold">
              Ranking & Skor
            </div>
            <div class="flex gap-2 items-end">
              <h3 class="font-semibold">
                <span class="text-4xl"
                  >#{{ leaderboard?.ranks[0]?.rank || "-" }}</span
                >
                <span class="text-xl">/{{ leaderboard?.total || "-" }}</span>
              </h3>

              <h3 class="flex items-center font-semibold">
                <Icon
                  class="text-yellow-500 mr-0.5"
                  name="ri:copper-coin-fill"
                />
                <span>{{ detail?.results?.totalScore }}</span>
              </h3>
            </div>
            <div>
              <RouterLink class="self-end" :to="routes.stage.leaderboard(id)"
                >Detail</RouterLink
              >
            </div>
          </CCardAlt>
        </div>

        <div v-if="detail?.stage.settings.periode">
          <div class="font-sans text-gray-500 text-xs font-semibold">
            Periode:
          </div>
          <h4 class="">
            {{ formatDate(detail.stage.settings.periode.startDate) }} -
            {{ formatDate(detail.stage.settings.periode.endDate) }}
          </h4>
          <!-- {{ leaderboard }} -->
        </div>

        <div>
          <div class="font-sans text-gray-500 text-xs font-semibold">
            Total Tantangan:
          </div>
          <h4 class="">{{ detail?.contents.length }}</h4>
        </div>
      </CCardAlt>

      <CTransitionPullIn :items="challenges" item-key="id" v-slot="{ item }">
        <RouterLink
          class="mb-4 block"
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
              <Icon class="text-yellow-500" name="ri:copper-coin-fill" />

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
