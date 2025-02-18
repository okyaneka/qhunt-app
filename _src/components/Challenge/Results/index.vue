<script setup lang="ts">
import dayjs from "dayjs";
import dayjsDuration from "dayjs/plugin/duration";
import type { UserChallenge } from "qhunt-lib";
import { routes } from "~/_src/helpers";

dayjs.extend(dayjsDuration);

interface Props {
  data: UserChallenge;
  stageId: string;
  animate: boolean;
}

useAttrs();

const { stageId, data, animate } = defineProps<Partial<Props>>();

const showScore = ref(false);

const results = computed(() => data?.results);
const timeUsed = computed(() => {
  const seconds = results.value?.timeUsed || 0;
  const dur = dayjs.duration(seconds, "seconds");

  let timeString = "";

  if (dur.minutes() > 0) timeString += `${dur.minutes()} menit `;
  if (dur.seconds() > 0) timeString += `${dur.seconds()} detik`;

  return timeString.trim();
});
</script>

<template>
  <Transition name="fade" mode="out-in">
    <CCard v-if="results" content-class="flex flex-col gap-2">
      <div>
        <div class="text-xl font-bold text-center">
          {{ data?.challenge.name }}
        </div>
        <div class="text-center capitalize">({{ data?.settings.type }})</div>
        <div class="text-4xl font-bold text-center">Selamat</div>
        <div class="text text-center">Kamu berhasil mengumpulkan</div>
        <div class="text-6xl font-bold text-center">
          <CAnimeCount
            :value="results.totalScore"
            :duration="animate ? 8e2 : 150"
            @finish="showScore = true"
          />
        </div>
        <div class="text-xl text-center">poin</div>
      </div>

      <Transition name="fade-up">
        <div v-if="showScore" class="flex justify-center">
          <div class="bg-light bg-opacity-10 p-1">
            <table>
              <tbody>
                <tr>
                  <td class="pr-4">
                    <div class="flex gap-1 items-center">
                      <Icon name="ri:time-fill" />
                      <span> Waktu Mengerjakan </span>
                    </div>
                  </td>
                  <td>
                    <div class="flex gap-1 items-center justify-end">
                      <span>
                        {{ timeUsed }}
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="pr-4">
                    <div class="flex gap-1 items-center">
                      <Icon name="ri:medal-fill" />
                      <span> Skor Dasar </span>
                    </div>
                  </td>
                  <td>
                    <div class="flex gap-1 items-center justify-end">
                      <span>
                        {{ results.baseScore }}
                      </span>
                      <Icon
                        class="text-yellow-600"
                        name="ri:copper-coin-fill"
                      />
                    </div>
                  </td>
                </tr>
                <tr v-if="results.contentBonus">
                  <td class="pr-4">
                    <div class="flex gap-1 items-center">
                      <Icon name="ri:trophy-fill" />
                      <span> Bonus Konten </span>
                    </div>
                  </td>
                  <td>
                    <div class="flex gap-1 items-center justify-end">
                      <span>
                        {{ results.contentBonus }}
                      </span>
                      <Icon
                        class="text-yellow-600"
                        name="ri:copper-coin-fill"
                      />
                    </div>
                  </td>
                </tr>
                <tr v-if="results.bonus">
                  <td class="pr-4">
                    <div class="flex gap-1 items-center">
                      <Icon name="ri:hourglass-fill" />
                      <span> Bonus Waktu </span>
                    </div>
                  </td>
                  <td>
                    <div class="flex gap-1 items-center justify-end">
                      <span>
                        {{ results.bonus }}
                      </span>
                      <Icon
                        class="text-yellow-600"
                        name="ri:copper-coin-fill"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Transition>
      <Transition name="fade-up">
        <div v-if="showScore && stageId" class="text-center mt-4 delay-150">
          <CButton
            as="link"
            :to="routes.stage.challenges(stageId)"
            variant="light"
            color="light"
            >Kembali</CButton
          >
        </div>
      </Transition>
    </CCard>
  </Transition>
</template>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  @apply transition-all duration-300;
}

.fade-up-enter-from,
.fade-up-leave-to {
  @apply translate-y-4 opacity-0;
}
</style>
