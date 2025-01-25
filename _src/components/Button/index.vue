<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { RouterLinkProps } from "vue-router";

useAttrs();

const {
  as = "button",
  color = "default",
  variant = "default",
  size = "md",
  disabled,
  icon,
  ...props
} = defineProps<
  Partial<RouterLinkProps> & {
    as?: "link" | "button";
    color?: "default" | "light";
    variant?: "default" | "light";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    icon?: boolean;
  }
>();

const setVariant = () => {
  switch (variant) {
    case "light":
      return `bg-dark ${
        disabled
          ? "text-opacity-50 bg-opacity-20"
          : "bg-opacity-30 hover:bg-dark hover:bg-opacity-20 active:bg-opacity-30"
      } transition `;

    default:
      return `bg-dark text-white ${
        disabled
          ? "bg-opacity-50 text-opacity-50"
          : "hover:bg-opacity-90 active:bg-opacity-80"
      } `;
  }
};

const setSize = () => {
  switch (size) {
    case "lg":
      return icon ? "h-14 w-14 text-xl " : "min-h-14 px-4 py-2 text-xl ";
    case "sm":
      return icon ? "h-7 w-7 text-sm " : "min-h-7 px-2 py-0.5 text-sm ";
    default:
      return icon ? "h-10 w-10 " : "min-h-10 px-4 py-2 ";
  }
};

const setIsIcon = () => {
  if (icon) return "rounded-full ";
  else return "rounded ";
};

const className: HTMLAttributes["class"] = computed(() => {
  let theClass =
    "button inline-flex justify-center items-center text-center transition select-none font-semibold ";
  theClass += setVariant();
  theClass += setIsIcon();
  theClass += setSize();

  if (color == "light") {
    theClass = theClass.replaceAll("dark", color);
    if (variant == "default")
      theClass = theClass.replaceAll("text-white", "text-dark");
  }

  return theClass.trim();
});
</script>

<template>
  <RouterLink
    v-if="as === 'link'"
    :class="className"
    v-bind="{ ...props }"
    :to="props.to || ''"
  >
    <slot />
  </RouterLink>
  <button v-else :class="className">
    <slot />
  </button>
</template>
