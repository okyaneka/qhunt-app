<script setup lang="ts">
import type { Qr } from "qhunt-lib";
import { request } from "~/_src/helpers";
import QrCode from "../QrCode/index.vue";

// import { request } from '~src/helpers';
const params = ref({ status: "publish" });

const { data, refetch } = request.get<{ data: { list: Qr[] } }>(
  "/admin/qr/list",
  { params }
);

const items = computed(() => data.value?.data.list);

onMounted(() => {
  // refetch();
});
</script>

<template>
  <div class="p-2 bg-light bg-opacity-50 break-words flex flex-col gap-2">
    <div>copy aja qr code nya disini, tapi belum ada, wong belum di setup</div>

    <transition-group name="fade" tag="div">
      <template v-for="(item, i) in items" :key="item.id">
        <div
          :style="{
            transitionDelay: `${i * 100}ms`,
          }"
        >
          <QrCode :content="item.code" />
          <div>code: {{ item.code }}</div>
          <div>content: {{ item.content?.type }}</div>
        </div>
        <hr v-if="i + 1 != items?.length" class="mb-2" />
      </template>
    </transition-group>
  </div>
</template>
