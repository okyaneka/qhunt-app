<script setup lang="ts">
import { common, routes } from "~/_src/helpers";
import { stage } from "~/_src/services";

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
    <CBarTitle> Tantangan Saya </CBarTitle>

    <!-- <div>
      <c-button @click="router.replace(routes.stage.prolog(id))"
        >Baleni</c-button
      >
    </div> -->

    <div class="flex flex-col gap-2 p-3">
      <div v-if="isFetched && !stages.length" class="flex justify-center">
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

      <RouterLink v-for="item in stages" :to="routes.stage.challenges(item.id)">
        <CCard hoverable content-class="flex items-center justify-between">
          <div>
            <div class="text-sm text-gray-200">
              <span class="italic"> ({{ item.status }}) </span>
            </div>
            <div class="text-lg">{{ item.stage.name }}</div>
          </div>
        </CCard>
      </RouterLink>
    </div>
  </div>
</template>
