<script setup lang="ts">
import { CCardAlt } from "#components";
import { useEnv } from "~/_src/configs/env";
import type { SliderItem } from "~/_src/helpers";
import { setTitle } from "~/_src/helpers/common";

const items: SliderItem[] = [
  {
    title: "Item 1",
    subtitle: "Subtitle 1",
    image:
      "https://i.pinimg.com/736x/77/e2/9e/77e29eb61d80200aee1c4cce6d4149ef.jpg",
  },
  {
    title: "Item 2",
    subtitle: "Subtitle 2",
    image:
      "https://i.pinimg.com/736x/d0/da/f0/d0daf0f78cee356911d3799d19cdcb05.jpg",
  },
  {
    title: "Item 3",
    subtitle: "Subtitle 3",
    image:
      "https://i.pinimg.com/736x/80/87/3a/80873a44b281234a622626c86237ca90.jpg",
  },
  {
    title: "Item 4",
    subtitle: "Subtitle 4",
    image:
      "https://i.pinimg.com/736x/5c/b5/a7/5cb5a7dd8a55ce0dc3ee935fa99664e6.jpg",
  },
  {
    title: "Item 5",
    subtitle: "Subtitle 5",
    image:
      "https://i.pinimg.com/736x/41/d5/2b/41d52b6464ad43a556e3e4ef3eb5bc41.jpg",
  },
];

const { $pwa } = useNuxtApp();
const env = useEnv();

setTitle("Home");
definePageMeta({ layout: "mobile" });
</script>

<template>
  <div class="flex flex-col">
    <div class="p-3 flex flex-col gap-4">
      <CCardAlt content-class="flex flex-col bg-dark text-white">
        <h4 class="text-center text-lg">Sugeng Rawuh dateng Para Petualang</h4>
        <h2 class="text-center">Selamat datang di {{ env.public.APP_NAME }}</h2>
      </CCardAlt>

      <CCardAlt>
        <h3>Ini slider</h3>
        <CSlider class="rounded-xl" :items="items" pause-on-hover navigation>
        </CSlider>
      </CCardAlt>
    </div>
  </div>
</template>
