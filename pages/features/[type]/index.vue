<script setup lang="ts">
import type { FeatureListParams, FeatureType } from "qhunt-lib";
import { capitalize } from "vue";
import type { Breadcrumb } from "~/_src/components/Breadcrumb/index.vue";
import { routes } from "~/_src/helpers";
import { setTitle } from "~/_src/helpers/common";
import { useFeatureListFetch } from "~/_src/services/admin/feature";

definePageMeta({ layout: "public" });

const route = useRoute();

const type = computed(() => route.params.type as FeatureType);
const params = ref<Partial<FeatureListParams>>({
  page: 1,
  limit: 1,
  type: type.value,
  status: "publish",
});
const { status, data } = await useFeatureListFetch({ params });

const isFetched = computed(() => status.value === "success");
const list = computed(() => data.value?.data.list || []);

const breadcrumb: Breadcrumb[] = [
  { title: "Home", href: routes.HOME },
  { title: capitalize(type.value), href: routes.FEATURE_TYPE(type.value) },
];

setTitle(capitalize(type.value));
</script>

<template>
  <div class="flex flex-col p-3 gap-4">
    <CLFeatureTitle :breadcrumb="breadcrumb" :title="capitalize(type)">
    </CLFeatureTitle>

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
