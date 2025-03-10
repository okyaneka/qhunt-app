<script setup lang="ts">
import type { StageListParams } from "qhunt-lib";
import { routes } from "~/_src/helpers";
import { formatDate } from "~/_src/helpers/common";
import { useStageList } from "~/_src/services/admin/stage";

definePageMeta({ layout: "desktop" });

const params = ref<Partial<StageListParams>>({
  page: 1,
  limit: 10,
});

const { data, isFetched } = useStageList({ params });

const items = computed(() => data.value?.data.list || []);
</script>

<template>
  <div class="p-3 flex flex-col gap-3">
    <h1 class="mb-2">Stage QR</h1>

    <CTransitionPullIn :items="items" item-key="id" v-slot="{ item }">
      <CCardAlt class="mb-3">
        <h3>{{ item.name }}</h3>
        <p class="capitalize">{{ item.status }}</p>
        <p>{{ item.contents.length }} Tantangan</p>
        <p>
          {{ formatDate(item.settings.periode?.startDate) }} -
          {{ formatDate(item.settings.periode?.endDate) }}
        </p>
        <div class="flex gap-2">
          <CButton size="sm" as="link" :to="routes.ADMIN.STAGE_DETAIL(item.id)">
            {{ item.status == "publish" ? "Detail" : "Edit" }}
          </CButton>
          <CButton
            as="link"
            size="sm"
            :to="routes.ADMIN.STAGE_DETAIL_QR(item.id)"
            >Detail QR</CButton
          >
        </div>
      </CCardAlt>
    </CTransitionPullIn>

    <CPagination
      v-if="isFetched"
      v-model:page="params.page"
      :total-page="data?.data.totalPages"
    />
  </div>
</template>
