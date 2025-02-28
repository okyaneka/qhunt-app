<script setup lang="ts">
import { common, routes } from "~/_src/helpers";
import { setTitle } from "~/_src/helpers/common";
import { stage } from "~/_src/services";

setTitle("Quests");
definePageMeta({
  layout: "mobile",
});

const route = useRoute();
const router = useRouter();

const { isFetched, data, refetch: getDetail } = stage.list();

const stages = computed(() => data.value?.data.list || []);
</script>

<template>
  <div class="flex flex-col">
    <CBarTitle> Quests </CBarTitle>

    <div class="flex flex-col gap-2 p-3">
      <template v-if="isFetched">
        <div v-if="!stages.length" class="flex justify-center">
          <CCard content-class="p-4">
            <div class="text-center">
              <Icon name="ri:box-2-line" size="40" />
            </div>
            <p class="text-center mb-2">
              Tantanganmu masih kosong nih. Yuk, cari bersama!
            </p>
            <p class="text-center">
              <CButton as="link" :to="routes.scan.index" color="light"
                >Cari Kode QRnya Sekarang!</CButton
              >
            </p>
          </CCard>
        </div>

        <CTransitionPullIn
          v-else
          :items="stages"
          item-key="id"
          v-slot="{ item }"
        >
          <RouterLink :to="routes.stage.challenges(item.id)">
            <CCardAlt
              hoverable
              content-class="flex items-center justify-between"
            >
              <div>
                <div class="text-gray-600">({{ item.status }})</div>
                <div class="text-lg">{{ item.stage.name }}</div>
              </div>
            </CCardAlt>
          </RouterLink>
        </CTransitionPullIn>
      </template>
    </div>
  </div>
</template>
