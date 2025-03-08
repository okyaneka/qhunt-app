<script setup lang="ts">
import type { FeatureListParams } from "qhunt-lib";
import type { Breadcrumb } from "~/_src/components/Breadcrumb/index.vue";
import { routes } from "~/_src/helpers";
import { setTitle } from "~/_src/helpers/common";
import {
  useFeatureList,
  useFeatureListFetch,
} from "~/_src/services/admin/feature";

definePageMeta({ layout: "public" });

const params = ref<Partial<FeatureListParams>>({
  page: 1,
  limit: 1,
  status: "publish",
});

const { status, data } = await useFeatureListFetch({ params });

const isFetched = computed(() => status.value === "success");
const list = computed(() => data.value?.data.list || []);

const breadcrumb: Breadcrumb[] = [
  { title: "Home", href: routes.HOME },
  { title: "Features", href: routes.FEATURE },
];

setTitle("Features");
</script>

<template>
  <div class="flex flex-col p-3 gap-4">
    <CLFeatureTitle :breadcrumb="breadcrumb" title="Features"> </CLFeatureTitle>

    <template v-if="list.length">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CLFeatureCard v-for="item in list" :item="item" :key="item.id">
        </CLFeatureCard>
      </div>
      <CPagination
        v-model:page="params.page"
        :total-page="data?.data.totalPages"
      />
    </template>
    <p v-else-if="isFetched">Belum ada artikel</p>
  </div>
</template>
