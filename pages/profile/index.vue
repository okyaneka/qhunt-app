<script setup lang="ts">
import { firebase } from "qhunt-lib/plugins/firebase";
import { routes, type ListItem } from "~/_src/helpers";
import { setTitle } from "~/_src/helpers/common";
import AuthService from "~/_src/services/auth-service";

setTitle("Profile");
definePageMeta({ layout: "mobile" });

const { auth } = useAuthStore();
const { mutate: logout } = AuthService.logout();

const items = ref([
  { label: "Syarat dan Ketentuan" },
  { label: "Kebujakan Privasi" },
  { label: "Tentang" },
]);

const actions = [
  {
    class: "text-red-500 hover:bg-red-500 hover:text-white",
    key: "logout",
    label: "Logout",
  },
];

const handleActionSelect = async (value: string) => {
  if (value === "logout") logout();
};
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
          <CAvatar class="shadow-card" :src="auth?.user?.photo" />
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

          <template v-if="auth?.user">
            <div class="flex flex-col items-center">
              <h1 class="font-bold text-2xl">{{ auth.user.name }}</h1>
              <p class="">{{ auth.user.email }}</p>
            </div>
          </template>
          <div
            v-else
            class="flex flex-col gap-1 items-center p-3 bg-light-50 rounded mb-4 w-72"
          >
            <div class="text-center mb-1">
              Kayaknya kamu belum pernah melakukan pendaftaran ya? Daftar dulu
              yuk! Biar progressmu tidak hilang.
            </div>

            <CButton as="link" :to="routes.register">Daftar dulu</CButton>

            <div>
              atau
              <RouterLink :to="routes.login">Login</RouterLink>
            </div>
          </div>
        </div>
      </CCardAlt>

      <CCardAlt>
        <h3 class="mb-2">Baca baca dulu yuk!</h3>
        <CList :items="items" item-key="label" v-slot="{ item }">
          {{ item.label }}
        </CList>
      </CCardAlt>

      <CCardAlt v-if="auth?.user">
        <CList
          :items="actions"
          item-key="key"
          v-slot="{ item }"
          @select="handleActionSelect"
        >
          {{ item.label }}
        </CList>
      </CCardAlt>
    </div>
  </div>
</template>
