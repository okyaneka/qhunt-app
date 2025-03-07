<script setup lang="ts">
type Props = { type: string[] | string; multiple: boolean };

const { type, multiple } = defineProps<Partial<Props>>();

const dropZoneRef = ref<HTMLElement>();
const inputRef = ref<HTMLInputElement>();

const onDrop = (files: File[] | null) => {
  console.log(files);
};

const { isOverDropZone, files } = useDropZone(dropZoneRef, {
  onDrop,
  dataTypes: typeof type == "string" ? [type] : type,
  multiple,
  preventDefaultForUnhandled: false,
});

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const filesa = target.files;
  if (filesa) files.value = Array.from(filesa);
};
</script>

<template>
  <div
    ref="dropZoneRef"
    class="flex px-3 py-12 justify-center rounded border bg-white cursor-pointer"
    :class="{ 'bg-gray-500': isOverDropZone }"
    @click="inputRef?.click()"
  >
    <input
      ref="inputRef"
      class="hidden"
      type="file"
      :multiple="multiple"
      @change="handleChange"
    />
    <slot v-if="$slots.default" />
    <div v-else>Drop files here {{ isOverDropZone }}</div>
  </div>
</template>
