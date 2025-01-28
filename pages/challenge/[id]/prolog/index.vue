<script setup lang="ts">
import { UserChallengeStatus } from "qhunt-lib/models/UserChallengeModel/types";
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
      [UserChallengeStatus.OnGoing, UserChallengeStatus.Completed].includes(
        detail.value.status
      )
    )
      router.replace(routes.challenge.action(detail.value.id));
  });
});
</script>

<template>
  <div class="flex flex-col gap-4 min-h-[calc(100vh-24px)]">
    <div v-if="isFetched" class="flex flex-col gap-2 my-auto">
      <template v-if="detail?.status == UserChallengeStatus.Undiscovered">
        <CCard content-class="text-center">
          <div class="text-xl">
            {{ detail.challenge.name }}
          </div>
          <div class="mb-2">Sayangnya belum ditemukan, coba cari lagi!</div>
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
