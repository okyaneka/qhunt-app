<script setup lang="ts">
import type { InputHTMLAttributes } from "vue";
import { useEnv } from "~/_src/configs/env";
import Editor from "@tinymce/tinymce-vue";
import type { S3Foreign } from "qhunt-lib";
import { useMediaDelete, useMediaUpload } from "~/_src/services/admin/media";
import { push } from "~/_src/helpers/toast";

type Value = {
  content: string;
  attachments: S3Foreign[];
};

type Props = {
  id: string;
  label: string;
  isInvalid: boolean;
  message: string;
  disabled: boolean;
  prependIcon: string;
  appendIcon: string;
} & Value;

type Emits = {
  (e: "update:content", value: Value["content"]): void;
  (e: "update:attachments", value: Value["attachments"]): void;
};

defineOptions({ inheritAttrs: false });

const {
  content = "",
  attachments = [],
  ...props
} = defineProps<Partial<Props>>();

const emit = defineEmits<Emits>();

const attrs = useAttrs() as InputHTMLAttributes;

const { mutate, isPending } = useMediaUpload();
const { mutate: deleteMutate, isPending: isDeletePending } = useMediaDelete({
  onSuccess: () => {
    if (deleteIndex.value !== undefined)
      emit(
        "update:attachments",
        attachments.filter((_, i) => i !== deleteIndex.value)
      );
    push("Attachment deleted");
    deleteIndex.value = undefined;
  },
});

const env = useEnv();
const inputRef = ref<HTMLInputElement>();
const deleteIndex = ref<number>();

const contentValue = computed({
  get: () => content,
  set: (val) => {
    emit("update:content", val);
  },
});

const attachmentsValue = computed(() => attachments);

const handleCopy = (url: string) => {
  navigator.clipboard.writeText(url);
  push("Copied to clipboard");
};

const handleInputChange = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (files) {
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
    formData.append("width", "800");
    formData.append("path", "attachments");

    mutate(formData, {
      onSuccess: (res) => {
        const {
          data: { data },
        } = res;
        emit("update:attachments", [...attachments, ...data]);
      },
    });
  }
  if (!inputRef.value) return;
  inputRef.value.type = "text";
  await nextTick();
  inputRef.value.type = "file";
};

onUnmounted(() => {
  // deleteMutate({
  //   keys: attachmentsValue.value.map((attachment) => attachment.fileName),
  // });
});
</script>

<template>
  <CBaseInput v-bind="props" as="textarea">
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>

    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>

    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>

    <template #default="{ id }">
      <div class="w-full px-3 py-2 overflow-auto max-h-[30rem]">
        <Editor
          :id="id"
          class="input min-h-40 content"
          :api-key="env.public.TINY_MCE_KEY"
          v-model="contentValue"
          :init="{
            menubar: false,
            plugins: 'lists link image anchor autolink',
            toolbar:
              'h1 h2 h3 h4 | bold italic underline | alignleft aligncenter alignright | bullist numlist | link | image',
            content_css: '* { padding: 0; margin: 0 }',
          }"
          inline
        />
      </div>
    </template>
  </CBaseInput>

  <div class="flex flex-col gap-2 items-start">
    <TransitionGroup tag="div" name="fade" class="flex flex-wrap gap-2">
      <div
        v-for="(attachment, i) in attachmentsValue"
        :key="attachment.fileName"
        class="cursor-pointer h-20 w-20 flex-none bg-cover bg-center hover:opacity-80 relative group transition"
        :style="{ backgroundImage: `url(${attachment.fileUrl})` }"
        @click="handleCopy(attachment.fileUrl)"
      >
        <div class="absolute top-0.5 right-0.5 hidden group-hover:flex">
          <CButton
            size="sm"
            icon
            @click.stop="
              deleteIndex = i;
              deleteMutate({ keys: [attachment.fileName] });
            "
          >
            <Icon name="ri:close-line" />
          </CButton>
        </div>

        <div
          v-if="isDeletePending && deleteIndex === i"
          class="w-full h-full flex items-center justify-center bg-dark bg-opacity-10"
        >
          <CSpinner />
        </div>
      </div>
    </TransitionGroup>

    <CButton
      append-icon="ri:image-add-fill"
      :loading="isPending"
      @click="inputRef?.click()"
    >
      Attachments
    </CButton>

    <input
      ref="inputRef"
      type="file"
      class="hidden"
      @change="handleInputChange"
      accept="image/*"
      multiple
    />
  </div>
</template>
