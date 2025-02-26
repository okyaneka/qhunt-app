<script setup lang="ts">
import { useForm } from "vee-validate";
import { toast } from "~/_src/helpers";

definePageMeta({ layout: "mobile" });

const show = ref(false);

const form = useForm();

const lights = [
  "rgb(250, 240, 231)",
  "rgb(245, 226, 206)",
  "rgb(240, 211, 182)",
  "rgb(236, 196, 157)",
  "rgb(231, 182, 133)",
  "rgb(226, 167, 108)",
  "rgb(221, 152, 84)",
  "rgb(184, 121, 58)",
  "rgb(137, 90, 43)",
  "rgb(89, 59, 28)",
  "rgb(42, 27, 13)",
];

const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.push("Code copied");
  });
};
</script>

<template>
  <div class="flex flex-col">
    <CBarTitle>Home</CBarTitle>

    <div class="px-3 flex flex-col gap-8">
      <CButton @click="show = true">Buka Modal</CButton>

      <CCardAlt content-class="flex flex-col gap-4">
        <h3>Ini ah</h3>

        <div class="flex gap-2 justify-center flex-nowrap">
          <div class="h-8 w-8 rounded-lg bg-dark-50"></div>
          <div class="h-8 w-8 rounded-lg bg-dark-100"></div>
          <div class="h-8 w-8 rounded-lg bg-dark-200"></div>
          <div class="h-8 w-8 rounded-lg bg-dark-300"></div>
          <div class="h-8 w-8 rounded-lg bg-dark-400"></div>
          <div class="h-8 w-8 rounded-lg bg-dark-500"></div>
          <div class="h-8 w-8 rounded-lg bg-dark-600"></div>
          <div class="h-8 w-8 rounded-lg bg-dark-700"></div>
          <div class="h-8 w-8 rounded-lg bg-dark-800"></div>
          <div class="h-8 w-8 rounded-lg bg-dark-900"></div>
          <div class="h-8 w-8 rounded-lg bg-dark-950"></div>
        </div>

        <div class="flex gap-2 justify-center flex-nowrap">
          <div class="h-8 w-8 rounded-lg bg-light-50"></div>
          <div class="h-8 w-8 rounded-lg bg-light-100"></div>
          <div class="h-8 w-8 rounded-lg bg-light-200"></div>
          <div class="h-8 w-8 rounded-lg bg-light-300"></div>
          <div class="h-8 w-8 rounded-lg bg-light-400"></div>
          <div class="h-8 w-8 rounded-lg bg-light-500"></div>
          <div class="h-8 w-8 rounded-lg bg-light-600"></div>
          <div class="h-8 w-8 rounded-lg bg-light-700"></div>
          <div class="h-8 w-8 rounded-lg bg-light-800"></div>
          <div class="h-8 w-8 rounded-lg bg-light-900"></div>
          <div class="h-8 w-8 rounded-lg bg-light-950"></div>
        </div>
      </CCardAlt>
    </div>

    <CModal v-model:show="show" title="Judul Modal">
      <div v-for="i in 100" class="mb-2">Ini Isi Modal</div>
    </CModal>
  </div>
</template>
