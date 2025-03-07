<script setup lang="ts">
import type { FeatureForm } from "~/_src/components/_locals/Feature/Form/index.vue";
import { objectToFormData, setTitle } from "~/_src/helpers/common";
import { push } from "~/_src/helpers/toast";
import { useFeatureUpdate } from "~/_src/services/admin/feature";

definePageMeta({ layout: "desktop" });
setTitle("Edit Feature");

const route = useRoute();

const id = computed(() => route.params.id as string);

const { mutate, isPending } = useFeatureUpdate(id.value);

const handleSubmit = (value: FeatureForm) => {
  const formData = objectToFormData(value);
  mutate(formData, {
    onSuccess: () => {
      push("Sukses bro 😎");
    },
  });
};
</script>

<template>
  <div class="p-3 flex flex-col gap-2">
    <h1>Edit Feature</h1>

    <CLFeatureForm :id="id" :is-loading="isPending" @submit="handleSubmit">
    </CLFeatureForm>
  </div>
</template>
