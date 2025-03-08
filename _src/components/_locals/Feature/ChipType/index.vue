<script setup lang="ts">
import type { FeatureType } from "qhunt-lib";

type Props = { type: FeatureType };

const { type = "info" } = defineProps<Partial<Props>>();
</script>

<template>
  <CChip v-if="type == 'event'" class="text-sm" type="success">Event</CChip>
  <CChip v-else-if="type == 'patch'" class="text-sm" type="warning"
    >Patch</CChip
  >
  <CChip v-else-if="type == 'info'" class="text-sm" type="info">Info</CChip>
</template>
