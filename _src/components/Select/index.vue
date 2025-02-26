<script
  setup
  lang="ts"
  generic="T extends { label: string; value: string } | string"
>
import type { SelectHTMLAttributes } from "vue";
import type { BaseInputProps } from "../_base/BaseInput.vue";

type Props<T> = {
  items: T[];
  itemLabel: keyof T;
  itemValue: keyof T;
} & BaseInputProps;

type Emits = {
  (e: "update:value", value: string): void;
};

defineOptions({ inheritAttrs: false });

const {
  items = [],
  itemLabel = "label",
  itemValue = "value",
  ...props
} = defineProps<Partial<Props<T>>>();

const emit = defineEmits<Emits>();

const attrs = useAttrs() as SelectHTMLAttributes;

const inputValue = computed({
  get: () => attrs.value || "",
  set: (val) => {
    emit("update:value", val);
  },
});
</script>

<template>
  <CBaseInput v-bind="props" as="select">
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>

    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>

    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>

    <template #default="{ id }">
      <select
        v-bind="attrs"
        v-model="inputValue"
        :id="id"
        class="w-full px-3 py-2"
        :class="{
          'cursor-not-allowed': disabled,
          'text-gray-500': !inputValue,
        }"
        :disabled="disabled"
      >
        <option v-if="attrs.placeholder" disabled selected hidden value="">
          {{ attrs.placeholder }}
        </option>
        <option
          v-for="item in items"
          :key="String(typeof item == 'string' ? item : item[itemValue as keyof T])"
          :value="typeof item == 'string' ? item : item[itemValue as keyof T]"
        >
          {{ typeof item == "string" ? item : item[itemLabel as keyof T] }}
        </option>
      </select>
      <Icon name="ri:arrow-down-s-fill" class="-mx-8" />
    </template>
  </CBaseInput>
</template>
