<script setup lang="ts">
import { useEnv } from "~/_src/configs/env";
import { setTitle } from "~/_src/helpers/common";
import { useStageDetailQr } from "~/_src/services/admin/stage";

definePageMeta({ layout: "desktop" });

const route = useRoute();

const id = route.params.id as string;

const { data } = useStageDetailQr(id);

const config = useEnv().public;
const detail = computed(() => data.value?.data);
const stage = computed(() => detail.value?.stage);
const challenges = computed(() => detail.value?.challenges);
const challnegeContents = computed(() => detail.value?.challnegeContents);

const stageName = computed(() => stage.value?.name || "");

const printUrl = (code: string) => `${config.APP_URL}/scan/${code}`;

const handlePrint = () => {
  window.print();
};

watch(stageName, () => {
  setTitle(stageName.value);
});
</script>

<template>
  <div class="p-3 flex flex-col gap-2">
    <div class="print:hidden">
      <h1 class="mb-2">Stage QR</h1>
      <CButton size="sm" append-icon="ri:printer-fill" @click="handlePrint"
        >Cetak</CButton
      >
    </div>

    <CCardAlt content-class="flex flex-col gap-2" flat>
      <div class="flex flex-wrap gap-2">
        <h4 class="w-full -mb-2">Stage</h4>
        <div v-if="stage" class="flex flex-col gap-1">
          <h5>{{ stageName }}</h5>
          <CQrCode
            :content="printUrl(stage.qr.code)"
            style="width: 7.5cm; height: 7.5cm"
          />
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <h4 class="w-full -mb-2">Challenges</h4>
        <div v-for="item in challenges" class="flex flex-col gap-1">
          <h5 class="mb-auto" style="width: 7.5cm">{{ item.name }}</h5>
          <CQrCode
            :content="printUrl(item.qr.code)"
            style="width: 7.5cm; height: 7.5cm"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <h4 class="-mb-2">Contents</h4>
        <template v-for="content in challnegeContents">
          <div v-if="content.contents.length" class="flex flex-wrap gap-2">
            <div class="w-full -mb-2">
              <h5 class="break-after-avoid-page">
                {{ content.challenge.name }}
                <span class="font-normal">({{ content.challenge.type }})</span>
              </h5>
              <div v-if="!content.contents.length">-</div>
            </div>
            <div v-for="item in content.contents" class="flex flex-col gap-1">
              <h6 class="mb-auto break-after-avoid-page" style="width: 7.5cm">
                {{ item.hint }}
              </h6>
              <CQrCode
                :content="item.qr.code"
                style="width: 7.5cm; height: 7.5cm"
              />
            </div>
          </div>
        </template>
      </div>
    </CCardAlt>
  </div>
</template>

<style scoped>
@media print {
  @page {
    size: A3 landscape;
    margin: 0;
  }

  main {
    margin: 0.5cm 0;
  }
}
</style>
