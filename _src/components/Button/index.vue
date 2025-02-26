<script setup lang="ts">
import { CLoader } from "#components";
import type { ButtonHTMLAttributes, HTMLAttributes } from "vue";
import { RouterLink, type RouterLinkProps } from "vue-router";

type Props = {
  as: "link" | "button";
  color: "default" | string;
  variant: "default" | "light" | "flat";
  size: "sm" | "md" | "lg";
  loading: boolean;
  disabled: boolean;
  bordered: boolean;
  icon: boolean;
  prependIcon: string;
  appendIcon: string;
} & RouterLinkProps;

const attrs = useAttrs() as Partial<ButtonHTMLAttributes>;

const {
  as = "button",
  color = "default",
  variant = "default",
  size = "md",
  disabled,
  icon,
  prependIcon,
  appendIcon,
  bordered,
  loading,
  ...props
} = defineProps<Partial<Props>>();

const linkAttrs = computed(() => ({
  ...props,
  class: attrs.class,
  style: attrs.style,
  to: props.to || "",
}));

const buttonAttrs = computed<ButtonHTMLAttributes>(() => ({
  type: "button",
  ...attrs,
  disabled: loading || attrs.disabled,
}));

const setVariant = () => {
  switch (variant) {
    case "light":
      return `bg-dark ${
        disabled ? "text-opacity-50 bg-opacity-20" : "bg-opacity-30"
      } `;
    case "flat":
      return `bg-dark bg-opacity-0 text-dark ${
        disabled ? "text-opacity-50" : ""
      } `;

    default:
      return `bg-dark text-white ${
        disabled ? "bg-opacity-50 text-opacity-50" : ""
      } `;
  }
};

const setSize = () => {
  switch (size) {
    case "lg":
      return icon ? "h-14 w-14 text-xl " : "min-h-14 px-4 py-2 text-xl ";
    case "sm":
      return icon ? "h-7 w-7 text-md " : "min-h-7 px-2 py-0.5 text-sm ";
    default:
      return icon ? "h-10 w-10 text-lg " : "min-h-10 px-4 py-2 ";
  }
};

const setIsIcon = () => {
  if (icon) return "rounded-full ";
  else return "rounded ";
};

const className: HTMLAttributes["class"] = computed(() => {
  let theClass =
    "button overlay overflow-clip inline-flex justify-center items-center text-center transition select-none font-semibold ";
  theClass += setVariant();
  theClass += setIsIcon();
  theClass += setSize();
  theClass += disabled ? "disabled " : "overlay-hover ";
  theClass += bordered ? "border " : "";

  if (color != "default") {
    theClass = theClass.replaceAll("dark", color);
    if (variant == "default")
      theClass = theClass.replaceAll("text-white", "text-dark");
  }
  if (color === "dark")
    theClass = theClass.replaceAll("text-dark", "text-white");

  return theClass.trim();
});
</script>

<template>
  <component
    :is="as === 'link' ? RouterLink : 'button'"
    :class="className"
    v-bind="as === 'link' ? linkAttrs : buttonAttrs"
  >
    <div
      v-if="(prependIcon && !icon) || loading"
      class="-ml-1 flex items-center gap-1"
      :class="{ 'mr-1': size === 'sm', 'mr-2': size !== 'sm' }"
    >
      <CSpinner v-if="loading" :light="color === 'dark'" />
      <Icon v-else-if="prependIcon" :name="prependIcon" />
    </div>
    <div class="inline-flex relative">
      <slot />
    </div>
    <div
      v-if="appendIcon && !icon"
      class="-mr-1 ml-1 flex items-center gap-1"
      :class="{ 'ml-1': size === 'sm', 'ml-2': size !== 'sm' }"
    >
      <Icon v-if="appendIcon" :name="appendIcon" />
    </div>
  </component>
</template>

<style scoped>
.button.overlay {
  @apply relative before:absolute before:inset-0 before:transition-all before:duration-300 before:bg-gray-400 before:mix-blend-luminosity;
}
.button.disabled {
  @apply before:bg-opacity-10;
}
.button.overlay-hover {
  @apply before:bg-opacity-0 before:hover:bg-opacity-40 before:active:bg-opacity-20;
}
</style>
