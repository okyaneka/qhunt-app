<script setup lang="ts">
import { setTitle } from "~/_src/helpers/common";
import LOGO from "~/_src/assets/images/logo.png";
import { routes } from "~/_src/helpers";
import { useEnv } from "~/_src/configs/env";

const config = useRuntimeConfig();
const env = useEnv();

definePageMeta({ layout: "blank" });
setTitle("About");
</script>

<template>
  <div class="flex flex-col">
    <div class="h-screen flex bg-light relative">
      <div class="m-auto flex flex-col items-center">
        <div class="text-center">
          <img class="h-32 w-3h-32" :src="LOGO" />
        </div>
        <h1 class="text-center">{{ config.public.APP_NAME }}</h1>
        <p class="text-center font-sans text-sm">
          Version {{ config.public.APP_VERSION }}
        </p>
        <p class="text-center"></p>
      </div>

      <div class="absolute w-full left-0 bottom-2 text-center animate-bounce">
        Scroll untuk melihat detail
      </div>
    </div>

    <div class="min-h-screen p-4 flex flex-col gap-4 snap-start snap-always">
      <h1 class="text-center">{{ config.public.APP_NAME }}</h1>

      <div class="flex flex-col gap-2">
        <h3>Apa itu {{ config.public.APP_NAME }}?</h3>
        <p class="text-justify">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam quidem
          repudiandae nesciunt labore. Dicta ipsam maiores eveniet officiis
          harum commodi odit possimus consequatur! Rerum possimus esse mollitia
          beatae iste pariatur.
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <h3>Fitur Utama</h3>
        <p class="text-justify">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam quidem
          repudiandae nesciunt labore. Dicta ipsam maiores eveniet officiis
          harum commodi odit possimus consequatur! Rerum possimus esse mollitia
          beatae iste pariatur.
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <h3>Tim</h3>
        <p class="text-justify">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam quidem
          repudiandae nesciunt labore. Dicta ipsam maiores eveniet officiis
          harum commodi odit possimus consequatur! Rerum possimus esse mollitia
          beatae iste pariatur.
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <h3>Kontak</h3>
        <p class="text-justify">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam quidem
          repudiandae nesciunt labore. Dicta ipsam maiores eveniet officiis
          harum commodi odit possimus consequatur! Rerum possimus esse mollitia
          beatae iste pariatur.
        </p>
      </div>

      <div class="mt-auto">
        <p class="text-center">
          &copy;2025
          <RouterLink :to="routes.home">{{ env.public.APP_NAME }}</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
