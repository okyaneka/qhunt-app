<script setup lang="ts">
import type { FeatureType } from "qhunt-lib";
import type { Breadcrumb } from "~/_src/components/Breadcrumb/index.vue";
import { routes } from "~/_src/helpers";
import { formatDate, setTitle } from "~/_src/helpers/common";
import { useFeatureDetailFetch } from "~/_src/services/admin/feature";
// import { useFeaturePublished } from "~/_src/services/admin/feature";

definePageMeta({ layout: "public" });

const route = useRoute();

const params = computed(() => ({
  type: route.params.type as FeatureType,
  slug: route.params.slug as string,
}));

const { data, status, error } = await useFeatureDetailFetch(
  params.value.type,
  params.value.slug
);

if (error.value) {
  console.error("API Error:", error.value);
}

const detail = computed(() => data.value?.data);
const breadcrumb = computed<Breadcrumb[]>(() => [
  { title: "Features", href: routes.FEATURE },
  { title: params.value.type, href: routes.FEATURE_TYPE(params.value.type) },
  { title: detail.value?.title || "", href: "#" },
]);

setTitle(detail.value?.title ?? "404 Artikel Tidak Ditemukan");
</script>

<template>
  <div v-if="error" class="flex flex-col gap-3 p-3">
    <CCardAlt class="my-4" decoration>
      <div class="py-8">
        <h2 class="text-center mb-2">404 - Artikel nya ga ketemu</h2>
        <div class="text-center">
          Cari konten menarik lainya
          <RouterLink :to="routes.home">di sini</RouterLink>
        </div>
      </div>
    </CCardAlt>
  </div>

  <div v-else-if="detail" class="flex flex-col p-3 gap-3">
    <CBreadcrumb :breadcrumb="breadcrumb" />
    <CCardAlt content-class="p-0">
      <div v-if="detail.featuredImage?.fileUrl" class="overflow-hidden">
        <img :src="detail.featuredImage.fileUrl" />
      </div>
      <div class="flex flex-col gap-3 p-4">
        <div>
          <h1 class="mb-1">{{ detail.title }}</h1>
          <p class="text-gray-500">{{ formatDate(detail.updatedAt) }}</p>
        </div>
        <div class="content" v-html="detail.content"></div>
        <div v-if="detail.quest">
          <h4>Event Quest</h4>
          <div class="flex">
            <CCardAlt flat content-class="p-2" to="#">
              <div class="flex flex-col gap-1">
                <div class="flex gap-1">
                  <div class="text-gray-500">Nama:</div>
                  <div>{{ detail.quest.name }}</div>
                </div>
                <div class="flex gap-2">
                  <div class="text-gray-500">Periode:</div>
                  <div>
                    {{ formatDate(detail.quest.settings.periode?.startDate) }} -
                    {{ formatDate(detail.quest.settings.periode?.endDate) }}
                  </div>
                </div>
              </div>
            </CCardAlt>
          </div>
        </div>
      </div>
    </CCardAlt>
  </div>
</template>
