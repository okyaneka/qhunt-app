<script setup lang="ts">
import qrcode from "qrcode";

const props = defineProps<{ content: string }>();

const qrCodeImage = ref("");

onMounted(() => {
  qrcode
    .toDataURL(props.content, {
      margin: 1,
      errorCorrectionLevel: "L",
      type: "image/png",
      width: 600,
    })
    .then((url) => (qrCodeImage.value = url));
});
</script>

<template>
  <Transition name="fade">
    <CCardAlt flat v-if="qrCodeImage">
      <img :src="qrCodeImage" alt="qrCodeImage" />
    </CCardAlt>
  </Transition>
</template>
