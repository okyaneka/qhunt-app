<script setup lang="ts">
import { common, routes } from "~/_src/helpers";
import { stage } from "~/_src/services";

const route = useRoute();
const router = useRouter();

const { data, refetch: getDetail } = stage.list();

const stages = computed(() => data.value?.data.list || []);
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="relative p-2">
      <div class="absolute left-0 top-1/2 -translate-y-1/2">
        <CButton icon variant="light" as="link" :to="routes.index">
          <Icon name="ri:home-2-fill" />
        </CButton>
      </div>
      <h1 class="text-2xl text-center px-8">Tantangan Saya</h1>
    </div>

    <!-- <div>
      <c-button @click="router.replace(routes.stage.prolog(id))"
        >Baleni</c-button
      >
    </div> -->

    <div class="flex flex-col gap-2">
      <div class="flex justify-center">
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
