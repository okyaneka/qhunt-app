<script setup lang="ts">
import { routes } from "~/_src/helpers";
import { setTitle } from "~/_src/helpers/common";
import { stage } from "~/_src/services";

definePageMeta({
  layout: "blank",
});

const route = useRoute();
const router = useRouter();

const id = computed(() => route.params.id as string);

const { data, refetch: getDetail, isFetched } = stage.detail(id);

setTitle(`Quest Prolog ${data.value?.data.stage.name}`);

onMounted(() => {
  getDetail();
});
</script>

<template>
  <CStoryProlog
    v-if="isFetched"
    :storyline="data?.data.stage.storyline || []"
    @click:finish="router.replace(routes.stage.challenges(id))"
  />
</template>
