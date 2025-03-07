<script setup lang="ts">
import type {
  Feature,
  FeaturePayload,
  FeatureStatus,
  FeatureType,
  Stage,
  StageForeign,
  StageListParams,
} from "qhunt-lib";
import { FEATURE_STATUS, FEATURE_TYPES } from "qhunt-lib/constants";
import slugify from "slugify";
import { useForm } from "vee-validate";
import { routes } from "~/_src/helpers";
import { formatDate } from "~/_src/helpers/common";
import { useFeatureDetail } from "~/_src/services/admin/feature";
import { useStageList } from "~/_src/services/admin/stage";

export type FeatureForm = Omit<FeaturePayload, "featuredImage"> & {
  featuredImage?: File;
};

type Props = {
  id: string;
  isLoading: boolean;
};

type Emits = {
  (e: "submit", value: FeatureForm): void;
};

defineOptions({ name: "FeatureForm" });
const emit = defineEmits<Emits>();
const { id, isLoading } = defineProps<Partial<Props>>();

const { values, resetForm, defineField, setFieldValue, handleSubmit, errors } =
  useForm<FeatureForm>();
defineField("title");
defineField("slug");
defineField("type");
defineField("status");
defineField("questId");
defineField("content");
defineField("attachments");
defineField("featuredImage");

const inputRef = ref<HTMLInputElement>();
const showModal = ref(false);
const search = ref();
const params = ref<Partial<StageListParams>>({});
const selectedQuest = ref<StageForeign>();

const { data: featureData, refetch: fetchDetail } = useFeatureDetail(id || "", {
  enabled: false,
});

const {
  data: stageData,
  isLoading: isStageLoading,
  refetch,
} = useStageList({
  params,
  enabled: false,
});

const feature = computed(() => {
  return featureData.value?.data;
});

const stageList = computed(() => {
  return stageData.value?.data.list;
});

const featureImageSrc = computed(() => {
  return values.featuredImage
    ? URL.createObjectURL(values.featuredImage)
    : feature.value?.featuredImage?.fileUrl || "";
});

const handleInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    setFieldValue("featuredImage", file);
  }
};

const setFormValues = () => {
  fetchDetail().then((res) => {
    if (res.data?.data) {
      const {
        data: { data },
      } = res;

      if (data.quest) selectedQuest.value = data.quest;
      resetForm({
        values: {
          title: data.title,
          slug: data.slug,
          status: data.status,
          type: data.type,
          questId: data.quest?.id,
          content: data.content,
          attachments: data.attachments,
        },
      });
    }
  });
};

const onSubmit = handleSubmit((value) => {
  emit("submit", value);
});

watch(
  () => isLoading,
  () => {
    if (!isLoading) setFormValues();
  }
);

onMounted(() => {
  if (id) setFormValues();
});
</script>

<template>
  <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
    <div>{{ values.featuredImage }}</div>
    <div>
      <label class="font-bold mb-1">Gambar fitur</label>
      <input
        ref="inputRef"
        type="file"
        class="hidden"
        accept="image/jpg,image/jpeg,image/png"
        @change="handleInputChange"
      />

      <div>
        <CCardAlt
          v-if="featureImageSrc"
          content-class="p-0 relative"
          hoverable
          flat
          @click="inputRef?.click()"
        >
          <div class="absolute top-1 right-1 flex gap-2">
            <CTooltip>
              <CButton size="sm" icon color="white">
                <Icon name="ri:information-line" />
              </CButton>
              <template #content>Klik untuk ganti gambar utama</template>
            </CTooltip>
            <CButton
              size="sm"
              icon
              @click.stop="setFieldValue('featuredImage', undefined)"
            >
              <Icon name="ri:close-line" />
            </CButton>
          </div>
          <img :src="featureImageSrc" class="object-cover rounded" />
        </CCardAlt>

        <div v-else>
          <div>Disarankan ukuran gambar adalah 750x250</div>
          <CButton @click="inputRef?.click()">Pilih Gambar Utama</CButton>
        </div>
      </div>
    </div>

    <CInput
      label="Judul"
      :value="values.title"
      :is-invalid="errors.title !== undefined"
      :message="errors.title"
      @change="setFieldValue('slug', slugify(values.title, { lower: true }))"
      @update:value="setFieldValue('title', $event)"
    >
      <template v-if="values.slug" #help-text>
        <div class="flex gap-1 items-center">
          <span> https://utaraa.com/events/{{ values.slug }} </span>
          <CTooltip
            ><Icon name="ri:information-line" />
            <template #content>
              <div>
                Ini adalah gambaran bagaimana halaman akan di publikasi. Link
                dapat saja mengalami perbedaan jika sudah ada link yang pernah
                di publikasi.
              </div>
            </template></CTooltip
          >
        </div>
      </template>
    </CInput>

    <CSelect
      :items="Object.values(FEATURE_STATUS)"
      label="Status"
      :value="values.status"
      @update:value="setFieldValue('status', $event as FeatureStatus)"
    ></CSelect>

    <CSelect
      :items="Object.values(FEATURE_TYPES)"
      label="Tipe"
      :value="values.type"
      @update:value="setFieldValue('type', $event as FeatureType)"
    ></CSelect>

    <div class="flex flex-col gap-2 items-start">
      <CCardAlt
        v-if="selectedQuest"
        flat
        hoverable
        content-class="h-40 w-40 flex flex-col justify-center items-center m-auto select-none"
        @click="showModal = true"
      >
        <h4 class="text-center">{{ selectedQuest.name }}</h4>
        <p class="text-center">
          {{
            `${formatDate(
              selectedQuest.settings.periode?.startDate,
              "DD-MM-YY"
            )} - ${formatDate(
              selectedQuest.settings.periode?.endDate,
              "DD-MM-YY"
            )}`
          }}
        </p>
      </CCardAlt>

      <CButton
        v-if="!selectedQuest"
        :disabled="values.type !== 'event'"
        @click="showModal = true"
        >Pilih Quest</CButton
      >
    </div>

    <CInputEditor
      :content="values.content"
      :attachments="values.attachments"
      @update:content="setFieldValue('content', $event)"
      @update:attachments="setFieldValue('attachments', $event)"
      label="Konten"
    ></CInputEditor>

    <CModal
      v-model:show="showModal"
      :width="600"
      title="Pilih Quest"
      content-class="flex flex-col gap-2"
      @open="refetch"
    >
      <div>
        <CInput
          placeholder="Cari Quest"
          append-icon="ri:search-line"
          v-model:value="search"
        />
      </div>

      <Transition name="fade-quick" mode="out-in">
        <TransitionGroup
          v-if="isStageLoading"
          tag="div"
          name="fade-quick"
          class="flex gap-2 flex-wrap"
        >
          <CSkeleton
            v-for="i in 3"
            class="h-40 w-40 flex-none rounded border"
            :key="i"
          />
        </TransitionGroup>

        <div v-else-if="!stageList?.length" class="w-full h-40 flex">
          <div class="m-auto">Data tidak ada</div>
        </div>

        <TransitionGroup
          v-else
          tag="div"
          name="fade-quick"
          class="flex gap-2 flex-wrap max-h-[480px] overflow-auto p-2 -m-2"
        >
          <CCardAlt
            v-for="item in stageList"
            :key="item.id"
            flat
            hoverable
            :class="{
              'ring-2 ring-light': values.questId === item.id,
              'select-none': true,
            }"
            content-class="h-40 w-40 flex flex-col justify-center items-center m-auto"
            @click="
              setFieldValue(
                'questId',
                values.questId !== item.id ? item.id : null
              )
            "
          >
            <h4 class="text-center">{{ item.name }}</h4>
            <p class="text-center">
              {{
                `${formatDate(
                  item.settings.periode?.startDate,
                  "DD-MM-YY"
                )} - ${formatDate(item.settings.periode?.endDate, "DD-MM-YY")}`
              }}
            </p>
            <p class="capitalize text-center">{{ item.status }}</p>
          </CCardAlt>
        </TransitionGroup>
      </Transition>

      <div class="flex gap-2 justify-end">
        <CButton color="light" variant="light" @click="showModal = false"
          >Batal</CButton
        >
        <CButton
          @click="
            selectedQuest = stageList?.find((v) => v.id == values.questId);
            showModal = false;
          "
          >Pilih</CButton
        >
      </div>
    </CModal>

    <div class="flex justify-end gap-2">
      <CButton
        :disabled="isLoading"
        color="light"
        variant="light"
        as="link"
        :to="routes.admin.feature.list"
        >Kembali</CButton
      >
      <CButton :loading="isLoading" type="submit">Simpan</CButton>
    </div>
  </form>
</template>
