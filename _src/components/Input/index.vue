<script setup lang="ts">
import type { InputHTMLAttributes } from "vue";

const INPUT_TYPES = [
  "date",
  "datetime-local",
  "email",
  "month",
  "number",
  "password",
  "search",
  "tel",
  "text",
  "time",
  "url",
  "week",
] as const;

type InputType = (typeof INPUT_TYPES)[number];

type Props = {
  id: string;
  label: string;
  isInvalid: boolean;
  message: string;
  togglePassword: boolean;
  disabled: boolean;
  prependIcon: string;
  appendIcon: string;
  type: InputType;
};

type Emits = {
  (e: "update:value", value: string): void;
};

defineOptions({ inheritAttrs: false });

const {
  togglePassword = false,
  type = "text",
  ...props
} = defineProps<Partial<Props>>();

const emit = defineEmits<Emits>();

const attrs = useAttrs() as InputHTMLAttributes;

const isShowPassword = ref(false);

const inputValue = computed({
  get: () => attrs.value,
  set: (val) => {
    emit("update:value", val);
  },
});
</script>

<template>
  <CBaseInput v-bind="props">
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>

    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>

    <template
      v-if="$slots.append || (type == 'password' && togglePassword)"
      #append
    >
      <slot name="append" />

      <template v-if="type == 'password' && togglePassword">
        <CButton
          icon
          variant="flat"
          size="sm"
          @click="isShowPassword = !isShowPassword"
        >
          <Transition name="flip" mode="out-in">
            <Icon
              v-if="isShowPassword"
              class="text-gray-400"
              name="ri:eye-off-line"
            />
            <Icon v-else class="text-gray-400" name="ri:eye-line" />
          </Transition>
        </CButton>
      </template>
    </template>

    <template #default="{ id }">
      <input
        v-bind="attrs"
        v-model="inputValue"
        :id="id"
        class="w-full"
        :class="{ 'cursor-not-allowed': disabled }"
        :disabled="disabled"
        :type="type == 'password' && isShowPassword ? 'text' : type"
      />
    </template>
  </CBaseInput>
</template>

<style scoped>
.flip-enter-active,
.flip-leave-active {
  @apply transition-all duration-150 ease-in;
}

.flip-enter-from,
.flip-leave-to {
  transform: rotateX(90deg);
}
</style>
