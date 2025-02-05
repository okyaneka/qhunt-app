<script setup lang="ts">
import { QR_CONTENT_TYPES } from "qhunt-lib/types";
import { routes } from "~/_src/helpers";
import { qr } from "~/_src/services";

const route = useRoute();
const router = useRouter();

const code = computed(() => route.params.code as string);

const { data, refetch: verify, isLoading, isError } = qr.verify(code);

watch(data, () => {
  if (!data.value) return;
  setTimeout(() => {
    switch (data.value.data.type) {
      case QR_CONTENT_TYPES.Challenge:
        return router.push(routes.challenge.prolog(data.value.data.refId));
      case QR_CONTENT_TYPES.Stage:
        return router.push(routes.stage.prolog(data.value.data.refId));
      default:
        break;
    }
  }, 1e3);
});

onMounted(() => {
  verify();
});
</script>

<template>
  <div class="min-h-screen -m-3 flex">
    <div class="m-auto flex">
      <CLoader v-if="isLoading"> Memverifikasi Data... </CLoader>
      <CCard v-if="isError"> Kode QR tidak valid </CCard>
    </div>
  </div>
</template>
