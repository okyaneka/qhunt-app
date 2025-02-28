<script setup lang="ts">
import { setTitle } from "~/_src/helpers/common";

setTitle("Notifications");
definePageMeta({ layout: "mobile" });
</script>

<template>
  <div class="flex flex-col">
    <CBarTitle>Notifikasi</CBarTitle>

    <div class="px-3 flex flex-col gap-8">
      <CCardAlt content-class="flex flex-col gap-4 decoration">
        <h3 class="text-center">Get ready soon</h3>
        <div class="text-center">
          I'm sorry guys. <br />Programmer only have two hands.
        </div>
      </CCardAlt>
    </div>
  </div>
</template>
