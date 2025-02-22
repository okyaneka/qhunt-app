import { flattenValues } from "../common";
import { useForm as veeForm } from "vee-validate";
import type { FormOptions } from "vee-validate";
import type { PartialDeep } from "../types";
import type { WatchHandle } from "vue";

export const useForm = <T extends Record<string, any>>(
  options?: FormOptions<T>
) => {
  const form = veeForm(options);

  const values = ref<PartialDeep<T>>(options?.initialValues || {});
  const watchers = ref<Record<string, WatchHandle>>({});

  const flatValues = computed(() => flattenValues(values.value));
  const flatKeys = computed(() => Object.keys(flatValues.value));

  const bindWatcher = (keys: string[]) => {
    keys.forEach((key) => {
      if (!watchers.value[key]) {
        watchers.value[key] = watch(
          () => flatValues.value[key],
          (value) =>
            keys.includes(key) &&
            value !== undefined &&
            debounceSetValue(key, value)
        );
      }
    });
  };

  const unbindWatcher = (keys: string[]) => {
    Object.keys(watchers.value).forEach((key) => {
      if (typeof watchers.value[key] == "function" && !keys.includes(key)) {
        watchers.value[key]();
        delete watchers.value[key];
      }
    });
  };

  const debounceWatcher = useDebounceFn((value: string[]) => {
    form.setValues(structuredClone(toRaw(values.value)));
    unbindWatcher(value);
    bindWatcher(value);
  }, 3e2);

  const debounceSetValue = useDebounceFn((key, value) => {
    form.setFieldValue(key, value);
  }, 3e2);

  watch(flatKeys, (value) => debounceWatcher(value), {
    immediate: true,
    deep: true,
  });

  return {
    ...form,
    values,
  };
};

const form = { useForm } as const;

export default form;
