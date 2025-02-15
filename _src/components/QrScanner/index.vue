<script setup lang="ts">
import { qrcode } from "qhunt-lib/helpers";
import { toast } from "~/_src/helpers";

interface Props {
  fromFile: boolean;
  hideFlashlight: boolean;
}

interface Emits {
  (e: "scanned", value: string): void;
}

const { fromFile = false, hideFlashlight = false } =
  defineProps<Partial<Props>>();

const emit = defineEmits<Emits>();

useAttrs();

const { camera } = toRefs(useConfigStore());

const mediaRef = ref<HTMLVideoElement>();
const inputRef = ref<HTMLInputElement>();
const stream = ref<MediaStream>();
const result = ref("");
const torchSupport = ref(false);
const isTorchOn = ref(false);
const isLoaded = ref(false);
const isDenied = ref<boolean>();

const setDevice = async () => {
  if (stream.value)
    stream.value.getTracks().forEach((track) => {
      track.stop();
    });

  const opts = camera.value ? { deviceId: { exact: camera.value } } : true;

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
      torchSupport.value = !!capabilities.torch;
      return res;
    });
};

const startScanning = () => {
  if (!stream.value || !mediaRef.value) return;
  result.value = "";
  qrcode.scanByStream(stream.value).then((res) => {
    emit("scanned", res.getText());
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
        throw err;
      });

  if (!camera.value) await getDevices();
};

const getDevices = async () => {
  const devices = (await navigator.mediaDevices.enumerateDevices()).filter(
    (v) => v.kind === "videoinput"
  );

  for (const device of devices) {
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
    camera.value = device.deviceId;
    track.stop();

    if (
      device.label.toLowerCase().includes("back") &&
      // @ts-ignore
      capabilities.focusMode &&
      // @ts-ignore
      (capabilities.focusMode as string[]).includes("continuous")
    )
      return;
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
      emit("scanned", res.getText());
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
  <div class="flex justify-center items-center bg-black">
    <div v-if="isLoaded" class="h-full w-full overflow-hidden relative">
      <video
        ref="mediaRef"
        class="w-full h-full object-cover absolute top-0 left-0 z-0"
        playsinline
        autoplay
      />

      <CButton
        v-if="torchSupport && !hideFlashlight"
        class="absolute top-[72px] right-4 z-[9999]"
        :class="{
          'bg-opacity-50': !isTorchOn,
          'bg-white !text-dark': isTorchOn,
        }"
        size="sm"
        icon
        @click="toggleTorch"
      >
        <Icon :name="isTorchOn ? 'ri:flashlight-fill' : 'ri:flashlight-line'" />
      </CButton>

      <Transition v-if="mediaRef" name="fade">
        <div class="z-10 relative">
          <slot
            :toggleTorch="toggleTorch"
            :isTorchOn="isTorchOn"
            :torchSupport="torchSupport"
          />
        </div>
      </Transition>

      <Transition v-if="mediaRef && fromFile" name="fade">
        <div class="absolute bottom-0 left-0 w-full p-4 flex flex-col gap-4">
          <div class="flex justify-center gap-2 z-10">
            <template v-if="fromFile">
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
            </template>
          </div>
        </div>
      </Transition>
    </div>
    <CCard v-else-if="isDenied" content-class="flex flex-col">
      <div class="text-center">
        <Icon name="ri:camera-off-fill" size="40" />
      </div>
      <div class="text-center max-w-72 mb-4">
        Ini kan scanner buat kode QR ya, jadi tolong aktifin kameranya ya. Kalau
        sudah, bisa Refresh halamanya. Terimakasih ❤️
      </div>
      <div class="text-center">
        <CButton color="light" @click="handleRefresh">Refresh</CButton>
      </div>
    </CCard>
    <CLoader v-else />
  </div>
</template>
