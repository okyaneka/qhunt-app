<script setup lang="ts">
type Props = {
  title: string;
  message: string;
  positiveText: string;
  negativeText: string;
  hideNegative: boolean;
  isLoading: boolean;
  show: boolean;
};

type Emits = {
  (e: "update:show", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
};

const emit = defineEmits<Emits>();
const {
  isLoading,
  show,
  hideNegative,
  title = "Konfirmasi",
  message = "Apakah anda yakin?",
  positiveText = "Ya",
  negativeText = "Tidak",
} = defineProps<Partial<Props>>();

const modelShow = computed({
  get: () => show,
  set: (value) => emit("update:show", value),
});
</script>

<template>
  <CModal v-model:show="modelShow" :title="title">
    <p class="mb-4 text-center">{{ message }}</p>

    <div class="flex gap-2 justify-center">
      <CButton
        v-if="!hideNegative"
        :disabled="isLoading"
        @click="
          emit('update:show', false);
          emit('cancel');
        "
        color="light"
      >
        {{ negativeText }}
      </CButton>
      <CButton :loading="isLoading" @click="emit('confirm')">
        {{ positiveText }}
      </CButton>
    </div>
  </CModal>
</template>
