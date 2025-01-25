<script setup lang="ts">
const { light = false } = defineProps<{ light?: boolean }>();
</script>

<template>
  <div class="flex flex-col gap-2 items-center">
    <div class="loader relative w-5 h-7">
      <div
        v-for="i in 5"
        :style="{ animationDelay: `${(i - 1) * 0.16}s` }"
        class="absolute w-full h-full left-1/2 origin-left rounded-sm opacity-0"
        :class="{ 'bg-light': light, 'bg-dark': !light }"
      ></div>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.loader {
  perspective: 67.2px;
}

.loader div {
  animation: book 2.6s infinite;
}

@keyframes book {
  0%,
  5% {
    opacity: 0;
  }
  20% {
    transform: rotateY(0deg);
  }
  40%,
  60% {
    opacity: 0.6;
  }
  80% {
    transform: rotateY(-180deg);
  }
  95%,
  100% {
    opacity: 0;
  }
}
</style>
