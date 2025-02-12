<script setup lang="ts">
import { USER_CHALLENGE_STATUS } from "qhunt-lib/types";
import { routes } from "~/_src/helpers";
import { challenge } from "~/_src/services";

definePageMeta({ layout: "blank" });

const route = useRoute();
const router = useRouter();

const id = computed(() => route.params.id as string);

const { data, refetch: getDetail, isFetched } = challenge.detail(id);

const detail = computed(() => data.value?.data);
const index = ref(0);
const guides = computed(() => detail.value?.challenge.storyline || []);
const line = computed(() => guides.value[index.value]);
const showConfirm = ref(false);

const nextLine = () => {
  if (index.value == guides.value.length - 1) showConfirm.value = true;
  else index.value++;
};

onMounted(() => {
  getDetail().then(() => {
    if (
      detail.value?.status &&
      ["ongoing", "completed"].includes(detail.value.status)
    )
      router.replace(routes.challenge.action(detail.value.id));
  });
});
</script>

<template>
  <div class="flex flex-col min-h-[calc(100vh-72px)]">
    <CBarTitle
      :back="
        detail?.userStage?.id
          ? routes.stage.challenges(detail.userStage.id)
          : routes.stage.index
      "
    ></CBarTitle>

    <div v-if="isFetched" class="flex flex-col gap-2 my-auto p-3">
      <template v-if="detail?.status == USER_CHALLENGE_STATUS.Undiscovered">
        <CCard content-class="text-center">
          <div class="text-xl">
            {{ detail.challenge.name }}
          </div>
          <div class="mb-2">
            Tantangan ini masih belum kamu temukan. Mari kita cari!
          </div>
          <div>
            <CButton as="link" :to="routes.scan.index" color="light"
              >Cari Kode QRnya Sekarang!</CButton
            >
          </div>
        </CCard>
      </template>
      <template v-else>
        <CCard content-class="flex flex-col gap-2">
          <CStoryTyping
            class="text-center text-xl"
            :content="line"
            :wpm="300"
            @click:finish="nextLine()"
            :guides="!showConfirm"
          />

          <Transition name="fade">
            <div v-if="showConfirm" class="justify-center flex gap-2">
              <CButton
                as="link"
                :to="routes.stage.challenges(detail?.userStage?.id as string)"
                color="light"
                variant="light"
                >Tidak, Belum.</CButton
              >
              <CButton
                as="link"
                :to="routes.challenge.action(detail?.id as string)"
                color="light"
                >Ya, Sudah.</CButton
              >
            </div>
          </Transition>
        </CCard>
      </template>
    </div>
  </div>
</template>
