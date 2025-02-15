<script setup lang="ts">
import dayjs from "dayjs";
import { push } from "~/_src/helpers/toast";

const score = ref(0);

const showHint = () => {
  push("Cari di bawah meja");
};

const onScanned = (value: string) => {
  console.log(value);
};
</script>

<template>
  <CQrScanner
    v-slot="{ toggleTorch, isTorchOn, torchSupport }"
    class="h-screen absolute top-0 left-0 w-full"
    hide-flashlight
    @scanned="onScanned"
  >
    <div class="flex flex-col gap-4 relative p-4">
      <div class="flex justify-center">
        <div class="local-card px-2 py-1 text-xl font-semibold text-white">
          {{ dayjs((60 * 5 - 24) * 1e3).format("mm:ss") }}
        </div>
      </div>

      <div class="flex flex-col items-end gap-2 min-w-44 relative">
        <div class="local-card p-2">
          <table class="w-full border-collapse">
            <tbody>
              <tr>
                <td class="pr-2">Objek Ditemukan</td>
                <td class="text-right">0</td>
              </tr>
              <tr class="pb-2">
                <td class="pr-2">Sisa Objek</td>
                <td class="text-right">5</td>
              </tr>
              <tr class="text-2xl pt-2 font-semibold">
                <td class="pr-2">Skor</td>
                <td class="text-right w">
                  <div class="flex gap-1 items-center">
                    <Transition name="move-out" mode="out-in">
                      <span
                        class="min-w-12"
                        :key="score"
                        @click="score = (score || 1) * 10"
                      >
                        {{ score }}
                      </span>
                    </Transition>
                    <Icon class="text-yellow-600" name="ri:copper-coin-fill" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex gap-2">
          <CButton
            icon
            size="sm"
            class="text-lg bg-opacity-60"
            @click="showHint"
          >
            i
          </CButton>
          <CButton
            v-if="torchSupport"
            :class="{
              'bg-opacity-50': !isTorchOn,
              'bg-white !text-dark': isTorchOn,
            }"
            size="sm"
            icon
            @click="toggleTorch"
          >
            <Icon
              :name="isTorchOn ? 'ri:flashlight-fill' : 'ri:flashlight-line'"
            />
          </CButton>
        </div>
      </div>
    </div>
  </CQrScanner>
</template>

<style scoped>
.local-card {
  @apply border border-dark-600 bg-dark bg-opacity-60 text-white;
}
</style>
