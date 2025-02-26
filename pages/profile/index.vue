<script setup lang="ts">
import { routes } from "~/_src/helpers";

definePageMeta({ layout: "mobile" });

const { auth } = useAuthStore();

const items = ref([
  { label: "Syarat dan Ketentuan" },
  { label: "Kebujakan Privasi" },
  { label: "Tentang" },
]);
</script>

<template>
  <div class="flex flex-col">
    <!-- :back="routes.home" icon="ri:home-4-fill" -->
    <CBarTitle> Profil Saya </CBarTitle>

    <div class="p-3 flex flex-col gap-3">
      <CCardAlt
        class="relative overflow-visible mt-16"
        content-class="decoration"
      >
        <!-- Avatar -->
        <div class="flex justify-center absolute w-full left-0 -top-16">
          <CAvatar class="shadow-card" :src="auth?.photo?.fileUrl" />
        </div>

        <!-- Action -->
        <div v-if="auth?.user" class="absolute top-0 right-0 p-2 flex">
          <CButton as="link" :to="routes.profileEdit" icon variant="flat">
            <Icon name="ri:pencil-fill" />
          </CButton>
        </div>

        <div class="flex flex-col items-center mt-20">
          <p class="font-sans text-gray-400 uppercase">
            {{ auth?.code.slice(0, 8) }}
          </p>

          <div v-if="auth?.user" class="flex flex-col items-center">
            <h1 class="font-bold text-2xl">{{ auth.user.name }}</h1>
            <p class="">{{ auth.user.email }}</p>
          </div>
          <div
            v-else
            class="flex flex-col gap-1 items-center p-3 bg-light-50 rounded mb-4 w-72"
          >
            <div class="text-center">
              Kayaknya kamu belum pernah melakukan pendaftaran ya? Daftar dulu
              yuk! Biar progressmu tidak hilang.
            </div>
            <CButton as="link" :to="routes.register" color="light"
              >Daftar dulu</CButton
            >
            <div>Atau</div>
            <CButton as="link" :to="routes.login" color="light">Login</CButton>
          </div>
        </div>
      </CCardAlt>

      <CCardAlt>
        <h3 class="mb-2">Baca baca dulu yuk!</h3>
        <CList :items="items" item-key="label" v-slot="{ item }">
          {{ item.label }}
        </CList>
      </CCardAlt>
    </div>
  </div>
</template>
