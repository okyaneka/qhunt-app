<script setup lang="ts">
import { QrContentType } from "qhunt-lib/models/QrModel/types";
import { routes } from "~/_src/helpers";
import { qr } from "~/_src/services";

const route = useRoute();
const router = useRouter();

const code = computed(() => route.params.code as string);

const { data, refetch: verify, isLoading, isError } = qr.verify(code);

watch(data, () => {
  if (!data.value) return;
  switch (data.value.data.type) {
    case QrContentType.Challenge:
      return router.push(routes.challenge.prolog(data.value.data.refId));
    case QrContentType.Stage:
      return router.push(routes.stage.prolog(data.value.data.refId));
    default:
      break;
  }
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
