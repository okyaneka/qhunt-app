<script setup lang="ts">
import type { FeatureListParams } from "qhunt-lib";
import LOGO from "~/_src/assets/images/logo-grey-trimmed.png";
import { routes } from "~/_src/helpers";
import { setTitle } from "~/_src/helpers/common";
import { push } from "~/_src/helpers/toast";
import {
  useFeatureDelete,
  useFeatureList,
} from "~/_src/services/admin/feature";

definePageMeta({ layout: "desktop" });
setTitle("Feature");

const search = ref("");
const deleteId = ref<string>("");
const params = ref<Partial<FeatureListParams>>({ page: 1, limit: 10 });
const deleteModal = ref(false);

const { data, refetch } = useFeatureList({ params });
const { mutate, isPending } = useFeatureDelete(deleteId);

const featureList = computed(() => data.value?.data.list || []);

const setParams = useDebounceFn(() => {
  params.value.search = search.value;
}, 5e2);

const handleDelete = (id: string) => {
  deleteId.value = id;
  deleteModal.value = true;
};

const handleConfirmDelete = () => {
  console.log("p");
  if (!deleteId.value) return push("Tidak ada feature yang dipilih");
  mutate(
    {},
    {
      onSuccess: () => {
        push("Feature berhasil dihapus");
        refetch();
        deleteModal.value = false;
      },
    }
  );
};

watch(search, () => {
  setParams();
});
</script>

<template>
  <div class="p-3 flex flex-col gap-2">
    <h1>Feature</h1>

    <div class="flex gap-2">
      <div class="flex gap-2 ml-auto">
        <CInput
          placeholder="Cari Judul"
          v-model:value="search"
          append-icon="ri:search-line"
        ></CInput>
        <CButton as="link" :to="routes.admin.feature.create" size="sm">
          Tambah Feature
        </CButton>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <CTransitionPullIn :items="featureList" item-key="id" v-slot="{ item }">
        <CCardAlt class="mb-3" content-class="flex gap-2">
          <div class="flex items-center h-40 border rounded">
            <div
              class="aspect-[3/1] h-24 bg-gray-100 bg-center bg-no-repeat"
              :class="{
                'bg-contain': !item.featuredImage?.fileUrl,
                'bg-cover': item.featuredImage?.fileUrl,
              }"
              :style="{
                backgroundImage: `url(${item.featuredImage?.fileUrl || LOGO})`,
              }"
            ></div>
          </div>

          <div class="flex flex-col gap-1">
            <h3>{{ item.title }}</h3>
            <p>{{ item.status }}</p>
            <p>
              <a :href="`/events/${item.type}/${item.slug}`" target="_blank">
                Kunjungi link
              </a>
            </p>
            <div class="flex gap-2">
              <CButton
                as="link"
                :to="routes.admin.feature.edit(item.id)"
                size="sm"
              >
                <Icon name="ri:pencil-line" />
              </CButton>
              <CButton
                size="sm"
                class="bg-red-500"
                @click="handleDelete(item.id)"
              >
                <Icon name="ri:delete-bin-line" />
              </CButton>
            </div>
          </div>
        </CCardAlt>
      </CTransitionPullIn>
    </div>

    <CLModalConfirm
      v-model:show="deleteModal"
      :is-loading="isPending"
      title="Hapus Feature"
      message="Apakah kamu yakin ingin menghapus feature ini?"
      @confirm="handleConfirmDelete()"
    />
  </div>
</template>
