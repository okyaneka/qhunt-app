<script setup lang="ts">
import { qrcode } from "qhunt-lib/helpers";
import { qr } from "~/_src/services";
import { routes, toast } from "~/_src/helpers";
import { QR_CONTENT_TYPES } from "qhunt-lib/types";

definePageMeta({
  layout: "blank",
});

const router = useRouter();

const mediaRef = ref<HTMLVideoElement>();
const inputRef = ref<HTMLInputElement>();
const stream = ref<MediaStream>();
const devices = ref<MediaDeviceInfo[]>();
const result = ref("");
const active = ref(0);
const isTorch = ref(false);
const isTorchOn = ref(false);
const isLoaded = ref(false);
const isDenied = ref<boolean>();

const { data, refetch: verify, isLoading } = qr.verify(result);

const activeDevice = computed(
  () => devices.value && devices.value[active.value]
);

const handleBack = () => {
  const canBack = window.history.length;
  canBack ? router.back() : router.push(routes.index);
};

const onVerify = (qrString: string) => {
  const qrResult = qrString;
  result.value =
    qrResult
      .split("/")
      .filter((v) => v.trim())
      .pop() || "";
  verify();
};

const setDevice = async () => {
  if (stream.value)
    stream.value.getTracks().forEach((track) => {
      track.stop();
    });

  const opts = activeDevice.value
    ? { deviceId: { exact: activeDevice.value.deviceId } }
    : true;

  stream.value = await navigator.mediaDevices
    .getUserMedia({
      video: opts,
    })
    .then(async (res) => {
      const track = res.getTracks()[0];
      const capabilities = track.getCapabilities();
      const divider = Math.round(
        // @ts-ignore
        Math.max(capabilities.height.max, capabilities.width.max) / 1000
      );
      await track.applyConstraints({
        // @ts-ignore
        height: capabilities.height.max / divider,
        // @ts-ignore
        width: capabilities.width.max / divider,
      });

      // @ts-ignore
      isTorch.value = !!capabilities.torch;
      return res;
    });
};

const startScanning = () => {
  if (!stream.value || !mediaRef.value) return;
  result.value = "";
  qrcode.scanByStream(stream.value).then((res) => {
    onVerify(res.getText());
    setTimeout(() => {
      startScanning();
    }, 1e3);
  });
};

const getPermission = async () => {
  const permission = await navigator.permissions.query({ name: "camera" });
  if (permission.state === "denied") return (isDenied.value = true);
  if (permission.state === "prompt")
    await navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => {
        const track = stream.getTracks()[0];
        track.stop();
      })
      .catch((err) => {
        isDenied.value = true;
        throw new err();
      });

  await getDevices();
};

const getDevices = async () => {
  devices.value = (await navigator.mediaDevices.enumerateDevices()).filter(
    (v) => v.kind === "videoinput"
  );

  let i = 0;
  for (const device of devices.value) {
    i++;
    const stream = await navigator.mediaDevices
      .getUserMedia({
        video: { deviceId: { exact: device.deviceId } },
      })
      .catch((e) => {
        console.log(e);
      });
    if (!stream) continue;
    const track = stream.getTracks()[0];
    const capabilities = track.getCapabilities();
    track.stop();

    if (
      // @ts-ignore
      capabilities.focusMode &&
      // @ts-ignore
      (capabilities.focusMode as string[]).includes("continuous")
    )
      active.value = i - 1;
  }
};

const toggleTorch = async () => {
  if (!stream.value) return;
  const track = stream.value.getTracks()[0];

  isTorchOn.value = !isTorchOn.value;
  // @ts-ignore
  await track.applyConstraints({ torch: isTorchOn.value });
};

const stopTrack = async () => {
  if (stream.value) stream.value.getTracks().forEach((track) => track.stop());
};

const onInputChange = async () => {
  if (!inputRef.value) return;
  const { files } = inputRef.value;
  if (!files) return;

  qrcode
    .scanByFile(files[0])
    .then((res) => {
      onVerify(res.getText());
    })
    .catch((e) => {
      toast.push(`qr code cannot be found`, { type: "error" });
    });
  inputRef.value.type = "text";
  await nextTick();
  inputRef.value.type = "file";
};

const handleRefresh = () => {
  location.reload();
};

watch([stream, mediaRef], async () => {
  if (stream.value && mediaRef.value) {
    mediaRef.value.srcObject = stream.value;
    startScanning();
  }
});

watch(data, () => {
  if (!data.value) return;
  switch (data.value.data.type) {
    case QR_CONTENT_TYPES.Challenge:
      return router.push(routes.challenge.prolog(data.value.data.refId));
    case QR_CONTENT_TYPES.Stage:
      return router.push(routes.stage.prolog(data.value.data.refId));
    default:
      break;
  }
});

onMounted(() => {
  getPermission()
    .then(() => setDevice())
    .then(() => (isLoaded.value = true));
});

onUnmounted(() => {
  stopTrack();
});
</script>

<template>
  <CCard v-if="isLoaded" class="h-[calc(100vh-24px)]" no-line>
    <div class="rounded h-full overflow-hidden relative p-2">
      <video
        ref="mediaRef"
        class="w-full h-full object-cover absolute top-0 left-0 z-0"
        playsinline
        autoplay
      />
      <Transition name="fade" mode="out-in">
        <div
          v-if="isLoading"
          class="absolute w-full h-full bg-black bg-opacity-20 left-0 top-0 flex justify-center items-center"
        >
          <CLoader light>Memeriksa Kode...</CLoader>
        </div>
      </Transition>
      <Transition v-if="mediaRef" name="fade">
        <div class="z-10 relative h-full flex flex-col gap-4">
          <div class="flex justify-center relative my-2">
            <div class="absolute left-0 top-1/2 -translate-y-1/2">
              <CButton icon variant="light" @click="handleBack">
                <Icon name="ri:arrow-left-s-line" />
              </CButton>
            </div>

            <CChip> Scan QR Disini </CChip>
          </div>

          <div class="p-2 mt-auto flex flex-col gap-4">
            <div class="flex justify-center gap-2 z-10">
              <input
                ref="inputRef"
                class="hidden"
                type="file"
                accept="image/png,image/jpeg"
                @change="onInputChange"
              />
              <CButton icon size="lg" @click="inputRef?.click()">
                <Icon name="ri:image-fill" />
              </CButton>
              <CButton v-if="isTorch" icon size="lg" @click="toggleTorch">
                <Icon
                  :name="
                    !isTorchOn ? 'ri:flashlight-fill' : 'ri:flashlight-line'
                  "
                />
              </CButton>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </CCard>

  <div v-else class="p-4 flex h-[calc(100vh-24px)] justify-center items-center">
    <CCard v-if="isDenied" content-class="flex flex-col">
      <div class="text-center">
        <Icon name="ri:camera-off-fill" size="40" />
      </div>
      <div class="text-center max-w-72 mb-4">
        Tolong aktifin kameranya ya. Kalau sudah bisa Refresh halamanya.
        Terimakasih
      </div>
      <div class="text-center">
        <CButton color="light" @click="handleRefresh">Refresh</CButton>
      </div>
    </CCard>
    <CLoader v-else />
  </div>
</template>

<!-- <template>
  <div class="p-4 flex h-[calc(100vh-24px)] justify-center items-center">
    <CLoader />
  </div>
</template> -->
