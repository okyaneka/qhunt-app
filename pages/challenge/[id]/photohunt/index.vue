<script setup lang="ts">
import {
  USER_CHALLENGE_STATUS,
  type UserChallengeResult,
} from "qhunt-lib/types";
import { common, routes } from "~/_src/helpers";
import { challenge } from "~/_src/services";

definePageMeta({
  layout: "blank",
  protected: true,
});

const route = useRoute();

const id = computed(() => route.params.id as string);
const { data, refetch, isLoading } = challenge.detail(id);
const confetti = ref<boolean>();

const detail = computed(() => data.value?.data);
const results = computed(() => detail.value?.results);

const handleFinish = () => {
  common.duar();
  confetti.value = true;
  refetch();
};
</script>

<template>
  <div class="flex flex-col min-h-[calc(100vh)] relative">
    <CBarTitle
      class="z-[9999] absolute top-0 left-0 w-full"
      v-if="detail?.userStage?.id"
      :back="routes.stage.challenges(detail?.userStage?.id)"
    ></CBarTitle>

    <Transition name="fade">
      <CChallengePhotohunt
        v-if="
          detail?.status === USER_CHALLENGE_STATUS.Discovered ||
          detail?.status === USER_CHALLENGE_STATUS.OnGoing
        "
        :id="detail.id"
        @finish="handleFinish"
      />

      <div v-else-if="results && !isLoading" class="relative my-auto px-3">
        <CChallengeResults
          :animate="confetti"
          :data="detail"
          :stageId="detail?.userStage?.id"
        />
      </div>
    </Transition>
  </div>
</template>
