<script setup lang="ts">
import type { FeatureType } from "qhunt-lib";
import { capitalize } from "vue";
import type { Breadcrumb } from "~/_src/components/Breadcrumb/index.vue";
import { routes } from "~/_src/helpers";
import { setTitle } from "~/_src/helpers/common";
import { useFeatureListPublished } from "~/_src/services/admin/feature";

definePageMeta({ layout: "public" });

const route = useRoute();

const type = computed(() => route.params.type as FeatureType);
const params = computed(() => ({ type: type.value }));
const { isFetched, data } = useFeatureListPublished({ params });

const list = computed(() => data.value?.data.list || []);

const breadcrumb: Breadcrumb[] = [
  { title: "Features", href: routes.FEATURE },
  { title: capitalize(type.value), href: routes.FEATURE_TYPE(type.value) },
];

setTitle(capitalize(type.value));
</script>

<template>
  <div class="flex flex-col p-3 gap-4">
    <CLFeatureTitle :breadcrumb="breadcrumb" :title="capitalize(type)">
    </CLFeatureTitle>

    <div v-if="isFetched" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <CLFeatureCard
        v-if="list.length"
        v-for="item in list"
        :item="item"
        :key="item.id"
      >
      </CLFeatureCard>
      <p v-else>Belum ada artikel</p>
    </div>
  </div>
</template>
