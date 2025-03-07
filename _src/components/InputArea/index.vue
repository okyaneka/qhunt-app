<script setup lang="ts">
import type { InputHTMLAttributes } from "vue";

type Props = {
  isInvalid: boolean;
  message: string;
  label: string;
  togglePassword: boolean;
  disabled: boolean;
  prependIcon: string;
  appendIcon: string;
};

type Emits = {
  (e: "update:value", value: string): void;
};

defineOptions({ inheritAttrs: false });

const { ...props } = defineProps<Partial<Props>>();
const emit = defineEmits<Emits>();

const attrs = useAttrs() as Partial<InputHTMLAttributes>;

const inputValue = computed({
  get: () => attrs.value,
  set: (val) => {
    emit("update:value", val);
  },
});
</script>

<template>
  <CBaseInput v-bind="props" as="textarea">
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>

    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>

    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>

    <template v-if="$slots['help-text']" #help-text>
      <slot name="help-text" />
    </template>

    <template #default="{ id }">
      <textarea
        v-bind="attrs"
        v-model="inputValue"
        :id="id"
        :disabled="disabled"
        class="w-full px-3 py-2"
        :class="{ 'cursor-not-allowed': disabled }"
      />
    </template>
  </CBaseInput>
</template>
