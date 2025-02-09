<script setup lang="ts">
import { CHALLENGE_TYPES } from "qhunt-lib/types";
import type { QrListParams } from "qhunt-lib";
import { toast } from "~/_src/helpers";
import { qr } from "~/_src/services";

const params = ref<Partial<QrListParams>>({ hasContent: true });

const { data } = qr.list(params);

const list = computed(() => data.value?.data.list);

const handleCopy = (text: string) => {
  navigator.clipboard
    .writeText(location.protocol + "//" + location.host + "/scan/" + text)
    .then(() => {
      toast.push("Code copied");
    });
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <CCard>
      <h1 class="text-center text-xl">List Kode QR</h1>
    </CCard>

    <div class="grid grid-cols-2 gap-4">
      <CCard v-for="item in list" content-class="h-full">
        <div class="mb-2">
          <CQrCode class="w-full" :content="item.code" />
        </div>
        <div class="text-center capitalize">{{ item.content?.type }}</div>
        <div class="text-center capitalize break-words">{{ item.code }}</div>
        <div class="text-center">
          <CButton icon color="light" @click="handleCopy(item.code)">
            <Icon name="ri:file-copy-line" />
          </CButton>
        </div>
      </CCard>
    </div>
  </div>
</template>
