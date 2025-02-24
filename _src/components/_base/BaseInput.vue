<script setup lang="ts">
export type BaseInputProps = {
  as: "input" | "textarea" | "select";
  id: string;
  label: string;
  isInvalid: boolean;
  message: string;
  disabled: boolean;
  prependIcon: string;
  appendIcon: string;
};

const { as = "input" } = defineProps<Partial<BaseInputProps>>();

const randomId = computed(
  () => `input-${getCurrentInstance()?.uid.toString(36)}`
);
</script>

<template>
  <div class="flex flex-col">
    <slot v-if="$slots.label" name="label" />
    <label v-if="label" :for="id || randomId" class="font-bold mb-1">
      {{ label }}
    </label>

    <div
      class="flex flex-nowrap gap-1.5 items-center rounded transition border"
      :class="{
        'border border-red-500 focus-within:ring-red-200': isInvalid,
        'bg-white ring-light-200 hover:ring-2 focus-within:ring-2': !disabled,
        'bg-gray-100 text-gray-800 cursor-not-allowed': disabled,
        'px-3 py-2 h-10': as == 'input',
      }"
    >
      <div
        v-if="$slots.prepend || prependIcon"
        class="-ml-1 flex flex-none items-center"
      >
        <slot v-if="$slots.prepend" name="prepend" />
        <Icon
          v-if="prependIcon"
          class="text-gray-500 flex-none"
          :name="prependIcon"
        />
      </div>

      <slot :id="id || randomId" />

      <div
        v-if="$slots.append || appendIcon"
        class="-mr-1 flex flex-nowrap items-center gap-1"
      >
        <slot v-if="$slots.append" name="append" />
        <Icon
          v-if="appendIcon"
          class="text-gray-500 flex-none"
          :name="appendIcon"
        />
      </div>
    </div>

    <div v-if="message" class="text-sm" :class="{ 'text-red-500': isInvalid }">
      {{ message }}
    </div>
  </div>
</template>
