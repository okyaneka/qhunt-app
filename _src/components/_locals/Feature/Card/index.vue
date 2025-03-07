<script setup lang="ts">
import { formatDate } from "~/_src/helpers/common";
import LOGO from "~/_src/assets/images/logo-grey-trimmed.png";
import type { Feature } from "qhunt-lib";
import { routes } from "~/_src/helpers";

type Props = {
  item: Feature;
};

const { item } = defineProps<Props>();

const imageError = ref(false);

const onImageError = () => {
  imageError.value = true;
};
</script>

<template>
  <CCardAlt
    content-class="p-0"
    :to="routes.FEATURE_CONTENT(item.type, item.slug)"
  >
    <div
      class="aspect-[3/1] bg-gray-100 bg-contain bg-center bg-no-repeat flex flex-col p-3 relative overflow-hidden"
      :style="{
        backgroundImage: `url(${LOGO})`,
      }"
    >
      <img
        v-if="item.featuredImage?.fileUrl && !imageError"
        class="absolute top-0 left-0 object-cover"
        :src="item.featuredImage.fileUrl"
        @error="onImageError"
      />
      <div class="mt-auto z-10">
        <CChip v-if="item.type == 'event'" class="text-sm" type="success"
          >Event</CChip
        >
        <CChip v-else-if="item.type == 'patch'" class="text-sm" type="warning"
          >Patch</CChip
        >
        <CChip v-else-if="item.type == 'info'" class="text-sm" type="info"
          >Info</CChip
        >
      </div>
    </div>
    <div class="p-3 flex flex-col gap-">
      <p class="text-gray-500">{{ formatDate(item.updatedAt) }}</p>
      <h3 title="s" class="truncate">{{ item.title }}</h3>
      <div></div>
    </div>
  </CCardAlt>
</template>
