<script setup lang="ts">
import { CHALLENGE_TYPES } from "qhunt-lib/types";
import { routes } from "~/_src/helpers";
import { challenge } from "~/_src/services";

definePageMeta({ layout: "blank" });

const route = useRoute();
const router = useRouter();

const id = computed(() => route.params.id as string);

const { data, refetch: getDetail, isFetched } = challenge.detail(id);

const detail = computed(() => data.value?.data);

onMounted(() => {
  getDetail().then(() => {
    switch (detail.value?.settings.type) {
      case CHALLENGE_TYPES.Trivia:
        return router.replace(routes.challenge.trivia(id.value));
      case CHALLENGE_TYPES.PhotoHunt:
        return router.replace(routes.challenge.photohunt(id.value));
      default:
        break;
    }
  });
});
</script>

<template></template>
