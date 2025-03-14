<script setup lang="ts">
import { qrcode } from "qhunt-lib/helpers";
import { toast } from "~/_src/helpers";
import type { ResultPoint } from "@zxing/library";

interface Props {
  fromFile: boolean;
  hideFlashlight: boolean;
  disabled: boolean;
  manual: boolean;
}

interface Emits {
  (e: "scanned", value: string): void;
  (e: "ready"): void;
}

const {
  disabled = false,
  fromFile = false,
  hideFlashlight = false,
  manual,
} = defineProps<Partial<Props>>();

const emit = defineEmits<Emits>();

useAttrs();

const { camera } = toRefs(useConfigStore());

const controller = ref(new AbortController());
const mediaRef = ref<HTMLVideoElement>();
const inputRef = ref<HTMLInputElement>();
const stream = ref<MediaStream>();
const torchSupport = ref(false);
const isTorchOn = ref(false);
const isLoaded = ref(false);
const isDenied = ref<boolean>();
const meta = ref<any>();
const lastFrame = ref<string>();

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
        Math.max(capabilities.height?.max || 0, capabilities.width?.max || 0) /
          1280
      );
      const constraints: MediaTrackConstraints = {
        height: (capabilities.height?.max || 0) / divider,
        width: (capabilities.width?.max || 0) / divider,
      };
      await track.applyConstraints(constraints);

      // @ts-ignore
      torchSupport.value = !!capabilities.torch;
      return res;
    });
  setTimeout(() => {
    emit("ready");
  }, 1e3);
};

const startScanning = () => {
  meta.value = undefined;
  controller.value.abort();
  if (!stream.value || !mediaRef.value) return;
  qrcode.scanByStream(stream.value).then((res) => {
    controller.value.signal.addEventListener("abort", () => {
      throw new Error("scan aborted");
    });

    const points = res.getResultPoints();
    setPosition(points);
    setTimeout(() => {
      emit("scanned", res.getText());
    }, 3e2);

    if (!manual) {
      setTimeout(() => {
        startScanning();
      }, 1e3);
    }
  });
};

const setPosition = (points: ResultPoint[]) => {
  if (mediaRef.value && points.length === 4) {
    const scaleX = mediaRef.value.clientWidth / mediaRef.value.videoWidth;
    const scaleY = mediaRef.value.clientHeight / mediaRef.value.videoHeight;
    const scale = Math.max(scaleX, scaleY);

    const Xs = points.map((v) => v.getX());
    const Ys = points.map((v) => v.getY());
    const x = Math.min(...Xs);
    const y = Math.min(...Ys);
    const width = Math.max(...Xs) - x;
    const height = Math.max(...Ys) - y;
    const offsetX =
      (mediaRef.value.videoWidth * scale - mediaRef.value.clientWidth) / 2;

    meta.value = {
      x: x * scale - offsetX,
      y: y * scale,
      width: width * scale,
      height: height * scale,
      scale,
    };
  }
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

const captureImage = () => {
  const canvas = document.createElement("canvas");

  const ctx = canvas.getContext("2d");
  if (!ctx || !mediaRef.value) return;
  canvas.width = mediaRef.value.videoWidth;
  canvas.height = mediaRef.value.videoHeight;
  ctx.drawImage(mediaRef.value, 0, 0, canvas.width, canvas.height);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    lastFrame.value = url;

    // const a = document.createElement("a");
    // a.href = url;
    // a.target = "_blank";
    // a.click();
  }, "image/jpg");

  canvas.remove();
};

watch(
  [stream, mediaRef],
  async () => {
    if (stream.value && mediaRef.value) {
      mediaRef.value.srcObject = stream.value;
      startScanning();
    }
  },
  { immediate: true }
);

watch(
  () => disabled,
  (value) => {
    if (!value) setDevice();
    else {
      captureImage();
      controller.value.abort();
      stopTrack();
    }
  }
);

defineExpose({ startScanning });

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
  <div class="qr-scanner flex justify-center items-center bg-black">
    <div v-if="isLoaded" class="h-full w-full overflow-hidden relative">
      <Transition name="fade-quick" mode="out-in">
        <img
          v-if="disabled"
          class="w-full h-full object-cover absolute top-0 left-0 z-0 blur"
          :src="lastFrame"
        />
        <video
          v-else
          ref="mediaRef"
          class="w-full h-full object-cover absolute top-0 left-0 z-0"
          playsinline
          autoplay
        />
      </Transition>

      <div
        v-if="!hideFlashlight || !fromFile"
        class="absolute top-16 right-4 z-[9999] flex gap-2"
      >
        <CButton
          v-if="torchSupport && !hideFlashlight"
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

        <template v-if="fromFile">
          <input
            ref="inputRef"
            class="hidden"
            type="file"
            accept="image/png,image/jpeg"
            @change="onInputChange"
          />
          <CButton icon size="sm" @click="inputRef?.click()">
            <Icon name="ri:image-fill" />
          </CButton>
        </template>
      </div>

      <Transition name="fade">
        <div class="z-10 relative h-full">
          <slot
            :toggleTorch="toggleTorch"
            :isTorchOn="isTorchOn"
            :torchSupport="torchSupport"
          />
        </div>
      </Transition>

      <div class="scanner-overlay">
        <div
          class="clip"
          :style="{
            left: meta?.x ? `${meta.x}px` : undefined,
            top: meta?.y ? `${meta.y}px` : undefined,
            width: meta?.width ? `${meta.width}px` : undefined,
            height: meta?.height ? `${meta.height}px` : undefined,
            transform: meta?.scale ? `scale(${meta.scale + 0.4})` : undefined,
          }"
        ></div>
      </div>

      <!-- Hanya detektor lokasi qr aja -->
      <div
        v-if="false"
        class="absolute w-28 h-28 transition-all text-white pulse -m-8"
        :style="{
          left: (meta?.x || 0) + 'px',
          top: (meta?.y || 0) + 'px',
          width: (meta?.width || 0) + 'px',
          height: (meta?.height || 0) + 'px',
        }"
      >
        <div
          class="absolute w-8 h-8 rounded-tl left-0 top-0 border-t-2 border-l-2"
        ></div>
        <div
          class="absolute w-8 h-8 rounded-tr -right-16 top-0 border-t-2 border-r-2"
        ></div>
        <div
          class="absolute w-8 h-8 rounded-br -right-16 -bottom-16 border-b-2 border-r-2"
        ></div>
        <div
          class="absolute w-8 h-8 rounded-bl left-0 -bottom-16 border-b-2 border-l-2"
        ></div>
      </div>
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
    <CLoader v-else light />
  </div>
</template>

<style lang="css" scoped>
.pulse {
  animation: pulse 500ms ease-in-out infinite alternate;
}

.scanner-overlay {
  @apply fixed inset-0 bg-transparent;
}

.scanner-overlay .clip {
  @apply absolute w-80 h-80 max-w-[calc(100vw-32px)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent rounded-lg transition-all;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 20px, rgba(0, 0, 0, 0.25) 0 0 0 200vw;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    /* scale: 1; */
    /* @apply scale-100; */
  }
  100% {
    transform: scale(0.95);
    /* scale: 1; */
    /* @apply scale-100; */
  }
}
</style>
