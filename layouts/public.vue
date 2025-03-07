<script setup lang="ts">
import { FEATURE_TYPES } from "qhunt-lib/constants";
import LOGO from "~/_src/assets/images/logo.png";
import { useEnv } from "~/_src/configs/env";
import { routes } from "~/_src/helpers";

const config = useEnv().public;
</script>

<template>
  <main class="public min-h-screen flex flex-col">
    <div class="px-3 py-2 shadow bg-white">
      <div class="container mx-auto flex items-center">
        <RouterLink :to="routes.home">
          <div class="flex gap-2 justify-center items-center">
            <img :src="LOGO" class="w-12 h-12 rounded" />
            <h1 class="select-none">{{ config.APP_NAME }}</h1>
          </div>
        </RouterLink>

        <div class="ml-auto flex gap-1 md:gap-10 sm:gap-4 transition-all">
          <RouterLink
            v-for="item in Object.values(FEATURE_TYPES)"
            :to="routes.FEATURE_TYPE(item)"
            class="capitalize text-xl font-medium px-2 sm:px-3 py-2 !text-dark-900"
          >
            {{ item }}
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="w-full max-w-[800px] mx-auto">
      <slot />
    </div>

    <div class="mt-auto">
      <div class="container py-4 mx-auto">
        <CCopy />
      </div>
    </div>
  </main>
</template>
