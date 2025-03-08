<script setup lang="ts">
import { CCardAlt } from "#components";
import type { BeforeInstallPromptEvent } from "@vite-pwa/nuxt/dist/runtime/plugins/types.js";
import { useEnv } from "~/_src/configs/env";
import { routes, type SliderItem } from "~/_src/helpers";
import { setTitle } from "~/_src/helpers/common";

const eventItems: SliderItem[] = [
  {
    title: "Solution Asik",
    subtitle: "10 - 14 Maret 2025",
    to: routes.FEATURE,
    image:
      "https://fastcdn.hoyoverse.com/mi18n/hk4e_global/m20250113hy6b9f6sjk/upload/58e465aaee62f27b354083bf165be907_3407777186208122567.jpg?x-oss-process=image/format,webp/quality,Q_90",
  },
  {
    title: "Solution Asik Banget",
    subtitle: "24 - 28 Maret 2025",
    to: routes.FEATURE,
    image:
      "https://act-webstatic.hoyoverse.com/puzzle/hk4e/pz_QaiBDjkyxb/resource/puzzle/2024/12/09/0fe98545fc1dc91013ae70e6c820f2fb_8135622234369919869.png?x-oss-process=image/format,webp/quality,Q_90",
  },
  {
    title: "Solution Bubar",
    subtitle: "21 Maret 2025",
    to: routes.FEATURE,
    image:
      "https://fastcdn.hoyoverse.com/static-resource-v2/2025/01/23/04e2c7e24871dd4ad27bc4fd073d31bc_9160196777764315976.jpg",
  },
];

setTitle("Home");
definePageMeta({ layout: "mobile" });

const { $pwa } = useNuxtApp();
const config = useEnv().public;
const prompt = ref<BeforeInstallPromptEvent>();

const setPrompt = (event: Event) => {
  event.preventDefault();
  prompt.value = event as BeforeInstallPromptEvent;
};

const install = async () => {
  if (prompt.value) {
    prompt.value.prompt();
  }
};

onMounted(() => {
  window.addEventListener("beforeinstallprompt", setPrompt);
});

onUnmounted(() => {
  window.removeEventListener("beforeinstallprompt", setPrompt);
});
</script>

<template>
  <div class="flex flex-col gap-4 px-3">
    <div class="flex justify-center items-center p-3 pb-0 gap-2">
      <img class="h-10" src="/public/icons/icon-96x96.png" />
      <h1>{{ config.APP_NAME }}</h1>
    </div>

    <CCardAlt content-class="p-0">
      <CSlider
        class="bg-cover bg-center"
        :height="200"
        pause-on-hover
        :interval="5e3"
        :style="{}"
      >
        <template #item-1>
          <div
            class="p-3 h-full flex flex-col justify-center items-center gap-2 relative bg-dark text-white"
            :style="{}"
          >
            <Icon
              class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-opacity-10 text-dark-300 text-[320px]"
              name="ri:sword-line"
            />
            <Icon
              class="absolute left-0 bottom-0 text-opacity-20 text-dark-400 text-[100px]"
              name="ri:sword-fill"
            />
            <Icon
              class="absolute right-0 bottom-0 text-opacity-20 text-dark-400 text-[100px]"
              name="ri:sword-fill"
            />
            <h2 class="text-center">Mari mulai petualanganmu!</h2>
            <CButton as="link" :to="routes.stage.index" color="light"
              >Tantangan Saya</CButton
            >
          </div>
        </template>
        <template #item-2>
          <div
            class="p-3 h-full flex flex-col justify-center items-center relative bg-light"
            :style="{}"
          >
            <Icon
              class="absolute left-2 bottom-0 text-opacity-20 text-dark text-[100px]"
              name="ph:treasure-chest"
            />
            <Icon
              class="absolute right-2 bottom-0 text-opacity-20 text-dark text-[100px]"
              name="ph:treasure-chest"
            />
            <h3 class="text-center">
              Kumpulkan skor sebanyak-banyaknya dan menangkan hadiah
              menarik!<small class="text-gray-500">*</small>
            </h3>
            <RouterLink class="!text-light-800" :to="routes.TERMS"
              >Syarat dan ketentuan</RouterLink
            >
          </div>
        </template>
        <template #item-3>
          <div
            class="p-3 h-full flex flex-col justify-center items-center relative bg-dark text-white"
            :style="{}"
          >
            <Icon
              class="absolute left-2 bottom-0 text-opacity-20 text-dark-400 text-[100px]"
              name="ri:door-closed-fill"
            />
            <Icon
              class="absolute right-2 bottom-0 text-opacity-20 text-dark-400 text-[100px]"
              name="ri:door-open-fill"
            />
            <h3 class="text-center">Tertarik menjadi relawan kami?</h3>
            <RouterLink :to="routes.CONTACT">Hubungi kami!</RouterLink>
          </div>
        </template>
      </CSlider>
    </CCardAlt>

    <CLHomeFeature />

    <CCardAlt v-if="!$pwa?.isPWAInstalled" decoration>
      <h4 class="text-center mb-4">
        Tingkatkan pengalamanmu dengan mengunduh aplikasi progresif kami
      </h4>
      <div class="text-center">
        <CButton color="light" @click="install"> Install Aplikasi </CButton>
      </div>
    </CCardAlt>

    <div class="flex justify-center gap-4">
      <RouterLink :to="routes.TERMS">Syarat dan Ketentuan</RouterLink>
      <RouterLink :to="routes.PRIVACY">Kebijakan Privasi</RouterLink>
      <RouterLink :to="routes.ABOUT">Tentang</RouterLink>
    </div>

    <div class="mt-auto">
      <CCopy no-link />
    </div>
  </div>
</template>

<style scoped>
@keyframes marquee {
  from {
    transform: translateX(60%);
  }
  to {
    transform: translateX(-100%);
  }
}

.animate-marquee {
  @apply select-none inline-block uppercase font-medium;
  animation: marquee 12s linear infinite;
}
.animate-marquee:hover {
  animation-play-state: paused;
}
</style>
