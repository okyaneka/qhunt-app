<script setup lang="ts">
import type { Breadcrumb } from "~/_src/components/Breadcrumb/index.vue";
import { routes } from "~/_src/helpers";
import { setTitle } from "~/_src/helpers/common";
import { useFeatureList } from "~/_src/services/admin/feature";

definePageMeta({ layout: "public" });

const { isFetched, data } = useFeatureList();

const list = computed(() => data.value?.data.list || []);

const breadcrumb: Breadcrumb[] = [{ title: "Features", href: routes.FEATURE }];

setTitle("Features");
</script>

<template>
  <div class="flex flex-col p-3 gap-4">
    <CLFeatureTitle :breadcrumb="breadcrumb" title="Features"> </CLFeatureTitle>

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
