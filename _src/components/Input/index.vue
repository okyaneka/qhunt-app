<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import type { InputHTMLAttributes } from "vue";

const IGNORED: Partial<Record<keyof InputHTMLAttributes, undefined>> = {
  type: undefined,
};

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
  isInvalid: boolean;
  message: string;
  label: string;
  togglePassword: boolean;
  type: InputType;
};

type Emits = {
  (e: "update:value", value: string): void;
};

const attrs = useAttrs() as Partial<InputHTMLAttributes>;

const {
  label,
  message,
  isInvalid = false,
  togglePassword = false,
  type = "text",
} = defineProps<Partial<Props>>();
const emit = defineEmits<Emits>();

const { disabled, class: elClass } = attrs;

const isShowPassword = ref(false);

const inputValue = computed({
  get: () => attrs.value,
  set: (val) => {
    emit("update:value", val);
  },
});
</script>

<template>
  <div :class="twMerge('flex flex-col', elClass)">
    <label v-if="label" :for="attrs.id" class="font-bold mb-1">{{
      label
    }}</label>
    <div
      class="flex flex-nowrap gap-1 items-center px-3 py-2 h-10 rounded transition border"
      :class="{
        'border border-red-500': isInvalid,
        'bg-gray-100 hover:bg-gray-50 focus-within:bg-gray-50 focus-within:ring-2 focus-within:ring-light':
          !disabled,
        'bg-gray-200 text-gray-800': disabled,
      }"
    >
      <div v-if="$slots.prepend" class="-ml-2">
        <slot name="prepend" />
        <!-- <CButton icon variant="flat" size="sm">
          <Icon class="text-gray-400" name="ri:user-line" />
        </CButton> -->
      </div>

      <input
        v-bind="{ ...attrs, ...IGNORED }"
        v-model="inputValue"
        :type="type == 'password' && isShowPassword ? 'text' : type"
        class="w-full"
      />

      <div
        v-if="$slots.append || (type == 'password' && togglePassword)"
        class="-mr-2 flex flex-nowrap gap-1"
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
        <!-- <CButton icon variant="flat" size="sm">
          <Icon class="text-gray-400" name="ri:search-line" />
        </CButton> -->
      </div>
    </div>
    <div
      v-if="isInvalid"
      class="text-sm"
      :class="{ 'text-red-500': isInvalid }"
    >
      {{ message }}
    </div>
  </div>
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
