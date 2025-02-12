<script setup lang="ts">
import type { UserChallengeResult } from "qhunt-lib";
import { routes } from "~/_src/helpers";

interface Props {
  results: UserChallengeResult;
  stageId: string;
  animate: boolean;
}

useAttrs();

const { stageId, results, animate } = defineProps<Partial<Props>>();

const showScore = ref(false);
</script>

<template>
  <Transition name="fade" mode="out-in">
    <CCard v-if="results" content-class="flex flex-col gap-2">
      <div>
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
                  <td class="pr-4">Jawaban benar</td>
                  <td>{{ results.totalCorrect }}</td>
                  <td>x</td>
                  <td class="text-right">
                    {{
                      results.totalCorrect != 0
                        ? results.baseScore / results.totalCorrect
                        : 0
                    }}
                  </td>
                </tr>
                <tr>
                  <td class="pr-4">Bonus Jawaban Benar</td>
                  <td>1</td>
                  <td>x</td>
                  <td class="text-right">{{ results.contentBonus }}</td>
                </tr>
                <tr>
                  <td class="pr-4">Bonus Waktu</td>
                  <td>1</td>
                  <td>x</td>
                  <td class="text-right">{{ results.bonus }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Transition>
      <Transition name="fade-up">
        <div v-if="showScore && stageId" class="text-center mt-4 delay-300">
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
