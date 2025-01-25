<script setup lang="ts">
import { ChallengeType } from "qhunt-lib/models/ChallengeModel/types";
import { routes } from "~/_src/helpers";
import { challenge } from "~/_src/services";

const route = useRoute();
const router = useRouter();

const id = computed(() => route.params.id as string);

const { data, refetch: getDetail, isFetched } = challenge.detail(id);

const detail = computed(() => data.value?.data);

onMounted(() => {
  getDetail().then(() => {
    switch (detail.value?.settings.type) {
      case ChallengeType.Trivia:
        router.replace(routes.challenge.trivia(id.value));
        break;
      default:
        break;
    }
  });
});
</script>

<template></template>
