<script setup lang="ts">
import { qrcode } from "qhunt-lib/helpers";
import { qr } from "~/_src/services";
import { routes, toast } from "~/_src/helpers";
import { QR_CONTENT_TYPES } from "qhunt-lib/types";

definePageMeta({
  layout: "blank",
});

const router = useRouter();

const { camera } = toRefs(useConfigStore());

const mediaRef = ref<HTMLVideoElement>();
const inputRef = ref<HTMLInputElement>();
const stream = ref<MediaStream>();
const devices = ref<MediaDeviceInfo[]>();
const result = ref("");
const isTorch = ref(false);
const isTorchOn = ref(false);
const isLoaded = ref(false);
const isDenied = ref<boolean>();

const { data, refetch: verify, isLoading } = qr.verify(result);

const onVerify = (qrString: string) => {
  result.value =
    qrString
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

  if (!camera.value) await getDevices();
};

const getDevices = async () => {
  devices.value = (await navigator.mediaDevices.enumerateDevices()).filter(
    (v) => v.kind === "videoinput"
  );

  for (const device of devices.value) {
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
  <CQrScanner class="h-screen w-full" from-file @scanned="onVerify">
    <CBarTitle :back="routes.index" variant="light">
      <CChip class="text-base font-normal"> Scan QR Disini </CChip>
    </CBarTitle>
  </CQrScanner>
</template>
