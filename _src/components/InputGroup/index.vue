<script setup lang="ts">
export type InputOption = {
  label: string;
  value: string | number | boolean;
};

type InputValue = boolean | string | number | string[] | number[];

type Props = {
  disabled: boolean;
  id: string;
  isInvalid: boolean;
  label: string;
  message: string;
  options: InputOption[];
  type: "radio" | "checkbox";
  view: "row" | "col";
  value: InputValue;
};

type Emit = {
  (e: "update:value", value: InputValue): void;
};

const {
  disabled,
  id,
  isInvalid,
  label,
  message,
  options = [],
  type,
  view = "col",
  value,
} = defineProps<Partial<Props>>();
const emit = defineEmits<Emit>();

const elId = computed(
  () => id || `input-${getCurrentInstance()?.uid.toString(36)}`
);

const inputValue = computed({
  get: () => value,
  set: (val: InputValue) => emit("update:value", val),
});
</script>

<template>
  <div class="flex flex-col">
    <slot v-if="$slots.label" name="label" :for="elId" />
    <label
      v-if="label"
      :for="elId"
      class="font-bold mb-1"
      :class="{
        'text-red-500': isInvalid && !disabled,
        'text-gray-400': disabled,
      }"
    >
      {{ label }}
    </label>

    <div
      class="flex gap-1"
      :class="{
        'flex-col items-start': view === 'col',
        'flex-row': view === 'row',
      }"
    >
      <label v-for="option in options" class="flex items-center gap-1">
        <div class="flex relative">
          <input
            :type="type"
            v-model="inputValue"
            :value="option.value"
            :disabled="disabled"
            :class="{
              '!border-red-500 checked:!bg-red-500': isInvalid,
              'bg-gray-100 text-gray-800 cursor-not-allowed': disabled,
            }"
          />
          <Icon
            class="text-white absolute top-0 left-0 w-full h-full cursor-pointer"
            name="ri:check-line"
          />
        </div>

        <span
          class="cursor-pointer"
          :class="{ 'text-gray-500': disabled, 'text-red-500': isInvalid }"
          >{{ option.label }}</span
        >
      </label>
    </div>
  </div>
</template>
