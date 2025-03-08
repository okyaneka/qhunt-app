<script setup lang="ts">
import HOME from "~/_src/assets/images/home.svg";
import WINNERS from "~/_src/assets/images/winners.svg";
import { useEnv } from "~/_src/configs/env";
import { routes } from "~/_src/helpers";

definePageMeta({ redirect: routes.HOME });

const env = useEnv();
</script>

<template>
  <div class="flex flex-col gap-4">
    <CCard content-class="flex flex-col">
      <h1 class="text-3xl font-bold text-center">
        Welcome to {{ env.public.APP_NAME }}
      </h1>
    </CCard>

    <CCard>
      <h3 class="text-center text-xl">
        Mampukah Kamu Mencapai Puncak Papan Para Pemimpin?
      </h3>
    </CCard>

    <CCard content-class="flex gap-4 p-4">
      <div
        class="flex-1 flex justify-center py-4"
        style="
          background: radial-gradient(
            circle,
            rgba(236, 198, 159, 0.3) 0%,
            rgba(236, 198, 159, 0.1) 40%,
            rgba(236, 198, 159, 0) 70%
          );
        "
      >
        <img :src="HOME" class="h-48" />
      </div>
      <div class="border-r border-light"></div>
      <div class="flex-1 flex justify-center flex-col gap-2">
        <h3 class="text-xl">
          Ayo Cari Kode QR nya Sekarang dan Selesaikan Tantanganya
        </h3>
        <div class="mb-2">Apakah Kamu Berani?</div>
        <CButton as="link" :to="routes.scan.index" color="light"
          >Cari Kode QR Sekarang</CButton
        >
      </div>
    </CCard>

    <CCard>
      <h3 class="text-center text-xl">
        Tantang Dirimu, Raih Poin, dan Menangkan Hadiah!
      </h3>
      <div
        class="flex-1 flex justify-center py-4"
        style="
          background: radial-gradient(
            circle,
            rgba(236, 198, 159, 0.2) 0%,
            rgba(236, 198, 159, 0) 50%
          );
        "
      >
        <img class="h-64" :src="WINNERS" />
      </div>
    </CCard>

    <CCard content-class="p-4 text-center">
      <CButton as="link" :to="routes.home" color="light">Buka Aplikasi</CButton>
    </CCard>

    <CCard content-class="flex flex-col gap-4">
      <h3 class="text-center text-xl">FAQ</h3>

      <p class="text-center">Soon</p>
    </CCard>

    <CCard content-class="p-4 text-center">
      <CButton as="link" :to="routes.scan.index" color="light"
        >Cari Kode QR Sekarang</CButton
      >
    </CCard>

    <CCard>
      <h3 class="text-center text-xl mb-2">QHunt App</h3>

      <div class="flex justify-center gap-4">
        <RouterLink to="/">Kebijakan Privasi</RouterLink>
        <RouterLink to="/">Syarat dan Ketentuan</RouterLink>
        <RouterLink to="/">Kontak</RouterLink>
      </div>
    </CCard>
  </div>
</template>
