<script setup lang="ts">
import { USER_CHALLENGE_STATUS } from "qhunt-lib/types";
import type { UserChallengeParams } from "qhunt-lib";
import { common, routes } from "~/_src/helpers";
import { stage, challenge } from "~/_src/services";

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

onMounted(() => {
  getDetail();
  getChallengeList();
});
</script>

<template>
  <div
    v-if="detailLoading || challengeLoading"
    class="p-4 flex h-[calc(100vh-24px)] justify-center items-center"
  >
    <CLoader />
  </div>

  <div v-else class="flex flex-col gap-4">
    <div class="relative p-2">
      <div class="absolute left-0 top-1/2 -translate-y-1/2">
        <CButton icon variant="light" as="link" :to="routes.stage.index">
          <Icon name="ri:arrow-left-s-line" />
        </CButton>
      </div>
      <h1 class="text-2xl text-center px-8">
        {{ detail?.stage.name }}
      </h1>
    </div>

    <!-- <div>
      <c-button @click="router.replace(routes.stage.prolog(id))"
        >Baleni</c-button
      >
    </div> -->

    <div class="flex flex-col gap-2">
      <CCard
        v-show="false"
        content-class="flex gap-4 justify-between items-center"
      >
        <div class="">
          <div class="flex gap-1 items-end">
            <span class="text-4xl font-bold">#1</span>
            <span>/100</span>
          </div>
          <RouterLink to="#">Lihat semua</RouterLink>
        </div>

        <div class="flex flex-col items-end">
          <div class="flex gap-1 text-3xl items-center">
            <Icon class="text-yellow-600" name="ri:copper-coin-fill" />
            {{ detail?.results?.totalScore }}
          </div>
        </div>
      </CCard>
      <RouterLink
        v-for="item in challenges"
        :to="routes.challenge.prolog(item.id)"
      >
        <CCard
          :class="{
            'bg-opacity-80 text-opacity-80':
              item.status === USER_CHALLENGE_STATUS.Undiscovered,
          }"
          hoverable
          content-class="flex items-center justify-between"
        >
          <div>
            <div class="text-sm text-gray-200">
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
        </CCard>
      </RouterLink>
    </div>
  </div>
</template>
