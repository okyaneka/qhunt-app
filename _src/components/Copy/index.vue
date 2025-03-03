<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useEnv } from "~/_src/configs/env";
import { routes } from "~/_src/helpers";

type Props = { noLink: boolean };

const { noLink } = defineProps<Partial<Props>>();

const env = useEnv();
</script>

<template>
  <p class="text-center">
    &copy;2025
    <component
      :is="noLink ? 'span' : RouterLink"
      :to="noLink ? undefined : routes.home"
      >{{ env.public.APP_NAME }}</component
    >
  </p>
</template>
