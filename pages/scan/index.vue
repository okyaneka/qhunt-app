<script setup lang="ts">
import { qrcode } from "qhunt-lib/helpers";
import { qr } from "~/_src/services";
import { routes, toast } from "~/_src/helpers";
import { QR_CONTENT_TYPES } from "qhunt-lib/types";

definePageMeta({
  layout: "blank",
});

const router = useRouter();

const result = ref("");

const isError = ref(false);

const {
  data,
  refetch: verify,
  isLoading,
  isError: queryError,
} = qr.verify(result);

const onVerify = (qrString: string) => {
  result.value =
    qrString
      .split("/")
      .filter((v) => v.trim())
      .pop() || "";
  verify();
};

watch(data, () => {
  if (!data.value) return;
  switch (data.value.data.type) {
    case QR_CONTENT_TYPES.Challenge:
      return router.push(routes.challenge.prolog(data.value.data.refId));
    case QR_CONTENT_TYPES.Stage:
      return router.push(routes.stage.prolog(data.value.data.refId));
    default:
      break;
  }
});

watch(queryError, () => {
  isError.value = queryError.value;
});
</script>

<template>
  <div class="flex flex-col gap-4 min-h-[calc(100vh)] relative">
    <CBarTitle
      :back="routes.index"
      class="z-[9999] absolute top-0 left-0 w-full"
      variant="light"
    >
      <CChip class="text-base font-normal"> Scan QR Disini </CChip>
    </CBarTitle>

    <CQrScanner
      class="h-screen w-full"
      :disabled="isError"
      from-file
      @scanned="onVerify"
    >
      <div class="h-full w-full relative">
        <Transition name="fade">
          <div
            v-if="isError"
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full p-4 flex justify-center"
          >
            <CCard class="max-w-full w-80" content-class="flex flex-col gap-2">
              <div>
                <div class="flex justify-center">
                  <Icon class="text-red-500" name="ri:close-line" size="48" />
                </div>

                <div class="text-xl font-bold text-center">
                  Ups. Kode QR nya tidak valid!
                </div>
              </div>

              <div class="text-center mt-4">
                <CButton color="light" @click="isError = false">
                  Cari Lagi!
                </CButton>
              </div>
            </CCard>
          </div>
        </Transition>
      </div>
    </CQrScanner>
  </div>
</template>
