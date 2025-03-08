<script setup lang="ts">
type Props = {
  page: number;
  totalPage: number;
  visiblePage: number;
};

type Emits = {
  (e: "update:page", value: number): void;
};

const {
  page = 1,
  totalPage = 1,
  visiblePage = 5,
} = defineProps<Partial<Props>>();

const emit = defineEmits<Emits>();

const pageModel = computed({
  get: () => page,
  set: (value: number) => emit("update:page", value),
});

const pages = computed(() => {
  const range: (number | string)[] = [];

  range.push(1);

  const rounded = Math.floor(visiblePage / 2);
  let start = Math.max(2, page - rounded + 1);
  let end = Math.min(totalPage - 1, start + rounded);

  // tot - 1  - rounded
  if (totalPage - rounded < end) start = Math.max(totalPage - 1 - rounded, 2);

  if (start > 2) range.push("");

  for (let i = start; i <= end; i++) range.push(i);

  if (end < totalPage - 1) range.push("");

  if (totalPage > 1) range.push(totalPage);

  return range;
});
</script>

<template>
  <div class="rounded inline-flex gap-1">
    <CButton
      size="sm"
      class="w-8 h-8"
      :disabled="page == 1"
      variant="light"
      @click="pageModel = page - 1"
    >
      <Icon name="ri:arrow-left-s-line" />
    </CButton>
    <CButton
      v-for="(item, i) in pages"
      :key="item"
      size="sm"
      class="w-8 h-8 whitespace-nowrap"
      :variant="pageModel == item ? 'default' : 'light'"
      @click="
        pageModel =
          typeof item == 'number'
            ? item
            : pageModel + (i - (Math.floor(visiblePage / 2) + 1))
      "
      >{{ item }}</CButton
    >

    <CButton
      size="sm"
      class="w-8 h-8"
      :disabled="page == totalPage"
      variant="light"
      @click="pageModel = page + 1"
    >
      <Icon name="ri:arrow-right-s-line" />
    </CButton>
  </div>
</template>
