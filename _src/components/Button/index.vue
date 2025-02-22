<script setup lang="ts">
import type { ButtonHTMLAttributes, HTMLAttributes } from "vue";
import { RouterLink, type RouterLinkProps } from "vue-router";

type Props = {
  as: "link" | "button";
  color: "default" | string;
  variant: "default" | "light" | "flat";
  size: "sm" | "md" | "lg";
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
  ...props
} = defineProps<Partial<Props>>();

const linkAttrs = computed(() => ({
  ...props,
  class: attrs.class,
  style: attrs.style,
  to: props.to || "",
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
    "button hover-overlay overflow-clip inline-flex justify-center items-center text-center transition select-none font-semibold ";
  theClass += setVariant();
  theClass += setIsIcon();
  theClass += setSize();
  theClass += bordered ? "border " : "";

  if (color != "default") {
    theClass = theClass.replaceAll("dark", color);
    if (variant == "default")
      theClass = theClass.replaceAll("text-white", "text-dark");
  }

  return theClass.trim();
});
</script>

<template>
  <component
    :is="as === 'link' ? RouterLink : 'button'"
    :class="className"
    v-bind="as === 'link' ? linkAttrs : attrs"
  >
    <Icon v-if="prependIcon && !icon" class="-ml-1 mr-2" :name="prependIcon" />
    <div class="inline-flex relative">
      <slot />
    </div>
    <Icon v-if="appendIcon && !icon" class="-mr-1 ml-2" :name="appendIcon" />
  </component>
</template>

<style scoped>
.hover-overlay {
  @apply relative before:absolute before:inset-0 before:bg-gray-100 before:bg-opacity-0 before:transition-all before:duration-300 before:mix-blend-luminosity before:hover:bg-opacity-30 before:active:bg-gray-500 before:active:bg-opacity-10;
}
</style>
