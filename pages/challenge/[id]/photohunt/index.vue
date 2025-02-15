<script setup lang="ts">
import dayjs from "dayjs";
import { push } from "~/_src/helpers/toast";

definePageMeta({
  layout: "blank",
  protected: true,
});
</script>

<template>
  <div class="flex flex-col min-h-[calc(100vh)] relative">
    <CChallengePhotohunt />

    <div class="m-auto relative">
      <CCard content-class="text-center">
        <div class="text-center mb-2">
          Terjadi kesalahan saat menghubungkan ke server
        </div>
        <div class="flex justify-center gap-2">
          <CButton color="light" variant="light" size="sm" as="link" :to="'/'"
            >Kembali</CButton
          >
          <CButton color="light" size="sm" @click="">Coba Lagi</CButton>
        </div>
      </CCard>
    </div>
  </div>
</template>
