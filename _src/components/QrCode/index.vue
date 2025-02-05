<script setup lang="ts">
import qrcode from "qrcode";

const props = defineProps<{ content: string }>();

const qrCodeImage = ref("");

onMounted(() => {
  qrcode
    .toDataURL(props.content, { margin: 1 })
    .then((url) => (qrCodeImage.value = url));
});
</script>

<template>
  <Transition name="fade">
    <img v-if="qrCodeImage" :src="qrCodeImage" alt="qrCodeImage" />
  </Transition>
</template>
