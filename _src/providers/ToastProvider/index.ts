import ToastProvider from "./index.vue";
import type { Bread } from "./types";

const breads = ref<Bread[]>([]);

const push = (
  message: Bread["message"],
  opts?: Partial<Omit<Bread, "message">>
) => {
  const bread: Bread = {
    key: Date.now()
      .toString(16)
      // .padStart(16, "0")
      .toUpperCase(),
    duration: opts?.duration || 3e3,
    message,
    type: opts?.type || "default",
  };

  breads.value.push(bread);

  setTimeout(() => {
    breads.value.shift();
  }, bread.duration);
};

export const useToastProvider = () => {
  return {
    breads,
    push,
  };
};

export * from "./types";

export default ToastProvider;
