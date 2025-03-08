<script setup lang="ts">
import type { FeatureListParams, FeatureType } from "qhunt-lib";
import { FEATURE_TYPES } from "qhunt-lib/constants";
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

const type = ref<FeatureType | "">("");
const search = ref("");
const deleteId = ref<string>("");
const params = ref<Partial<FeatureListParams>>({
  page: 1,
  limit: 10,
  type: undefined,
});
const deleteModal = ref(false);

const { isFetched, data, refetch } = useFeatureList({ params });
const { mutate, isPending } = useFeatureDelete(deleteId);

const featureList = computed(() => data.value?.data.list || []);

const setParams = useDebounceFn(() => {
  params.value.search = search.value;
  params.value.type = type.value ? type.value : undefined;
}, 5e2);

const handleDelete = (id: string) => {
  deleteId.value = id;
  deleteModal.value = true;
};

const handleConfirmDelete = () => {
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

watch([search, type], () => {
  setParams();
});
</script>

<template>
  <div class="p-3 flex flex-col gap-2">
    <h1>Feature</h1>

    <div class="flex gap-2">
      <div class="flex gap-2 ml-auto">
        <div class="w-32">
          <CSelect
            v-model:value="type"
            :items="['', ...Object.values(FEATURE_TYPES)]"
            placeholder="Tipe"
          />
        </div>
        <CInput
          placeholder="Cari Judul"
          v-model:value="search"
          append-icon="ri:search-line"
        ></CInput>
        <CButton as="link" :to="routes.admin.feature.create" size="sm">
          Tambah
        </CButton>
      </div>
    </div>

    <div v-if="isFetched" class="flex flex-col gap-3">
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
            <div>
              <CLFeatureChipType :type="item.type" />
            </div>

            <p class="flex gap-1">
              <span class="capitalize">
                {{ item.status }}
              </span>
              <span class="font-bold" v-if="item.featured"> Featured </span>
            </p>

            <p>
              <a :href="`/features/${item.type}/${item.slug}`" target="_blank">
                Kunjungi link
              </a>
            </p>
            <div class="flex gap-1">
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
                <Icon name="ri:archive-fill" />
              </CButton>
            </div>
          </div>
        </CCardAlt>
      </CTransitionPullIn>

      <div v-if="!featureList.length">Belum ada artikel</div>

      <div v-else>
        <CPagination
          v-model:page="params.page"
          :total-page="data?.data.totalPages"
        />
      </div>
    </div>

    <CLModalConfirm
      v-model:show="deleteModal"
      :is-loading="isPending"
      title="Arsip Feature"
      message="Apakah kamu yakin ingin mengarsipkan feature ini?"
      @confirm="handleConfirmDelete()"
    />
  </div>
</template>
