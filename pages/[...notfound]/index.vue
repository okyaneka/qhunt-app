<script setup lang="ts">
import { routes } from "~/_src/helpers";
import { setTitle } from "~/_src/helpers/common";

setTitle("Halaman Tidak Ditemukan");
</script>

<template>
  <div class="flex flex-col gap-3 p-3">
    <CCardAlt class="my-4" decoration>
      <div class="py-8">
        <h2 class="text-center mb-2">404 - Halaman ga ketemu</h2>
        <div class="text-center">
          Cari konten menarik lainya
          <RouterLink :to="routes.home">di sini</RouterLink>
        </div>
      </div>
    </CCardAlt>
  </div>
</template>
