<script setup lang="ts">
useAttrs();

const emit = defineEmits<{ (e: "finish"): void }>();

const { value, duration = 500 } = defineProps<{
  value: number;
  duration?: number;
}>();

const result = ref(0);
const acc = computed(() => Math.round(value / (duration / 50)));

const count = () => {
  setTimeout(() => {
    if (
      (value < 0 && result.value > value) ||
      (value > 0 && result.value < value)
    ) {
      result.value += acc.value;
      return count();
    }
    result.value = value;
    emit("finish");
  }, 50);
};

onMounted(() => {
  count();
});
</script>

<template>
  <span>{{ result }}</span>
</template>
