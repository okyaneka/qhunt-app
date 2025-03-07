<script setup lang="ts">
import { objectToFormData, setTitle } from "~/_src/helpers/common";
import { useFeatureCreate } from "~/_src/services/admin/feature";
import { push } from "~/_src/helpers/toast";
import type { FeatureForm } from "~/_src/components/_locals/Feature/Form/index.vue";
import { routes } from "~/_src/helpers";

definePageMeta({ layout: "desktop" });
setTitle("Create Feature");

const router = useRouter();
const { isPending, mutate } = useFeatureCreate();

const handleSubmit = async (value: FeatureForm) => {
  const formData = objectToFormData(value);
  mutate(formData, {
    onSuccess: () => {
      push("Sukses bro 😎");
      router.push(routes.admin.feature.list);
    },
  });
};
</script>

<template>
  <div class="p-3 flex-col gap-2">
    <h1>Feature</h1>

    <CLFeatureForm :is-loading="isPending" @submit="handleSubmit" />
  </div>
</template>
