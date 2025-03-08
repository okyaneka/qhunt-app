<script setup lang="ts">
import { useFeatureListFetch } from "~/_src/services/admin/feature";
import type { FeatureType } from "qhunt-lib";
import { routes, type SliderItem } from "~/_src/helpers";
import { formatDate } from "~/_src/helpers/common";

type Props = {
  type: FeatureType;
  limit: number;
};

const { type = "event", limit = 5 } = defineProps<Partial<Props>>();

const params = computed(() => ({ limit, type }));

const { data } = await useFeatureListFetch({ params });

const items = computed<SliderItem[]>(() => {
  return (data.value?.data.list || []).map((item) => ({
    title: item.title,
    image: item.featuredImage?.fileUrl,
    subtitle: item.quest
      ? `${formatDate(item.quest?.settings.periode?.startDate)} - ${formatDate(
          item.quest?.settings.periode?.endDate
        )}`
      : "",
    to: routes.FEATURE_CONTENT(item.type, item.slug),
  }));
});
</script>

<template>
  <CCardAlt>
    <div class="mb-2">
      <h3>Event Spesial Buat Kamu!</h3>
    </div>
    <CSlider
      :height="200"
      pause-on-hover
      navigation
      arrow
      :interval="5e3"
      :items="items"
    >
    </CSlider>
  </CCardAlt>
</template>
