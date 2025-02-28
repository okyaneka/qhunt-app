<script setup lang="ts">
// import auth from "~/_src/services/auth";
import { push } from "~/_src/helpers/toast";
import { routes } from "~/_src/helpers";
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import * as yup from "yup";
import AuthService from "~/_src/services/auth-service";
import dayjs from "dayjs";
import { type UserPublicGender, type UserPublicPayload } from "qhunt-lib";
import { USER_PUBLIC_GENDER } from "qhunt-lib/constants";
import { setTitle } from "~/_src/helpers/common";

setTitle("Edit Profile");
definePageMeta({
  middleware: "auth",
  layout: "mobile",
});

const schema = yup.object({
  name: yup.string().required(),
  gender: yup.string().required().oneOf(Object.values(USER_PUBLIC_GENDER)),
  dob: yup
    .date()
    .transform((value, originalValue) => {
      return dayjs(originalValue, "YYYY-MM-DD", true).isValid()
        ? new Date(dayjs(originalValue).format("YYYY-MM-DD"))
        : new Date(""); // Invalid date fallback
    })
    .required(),
  phone: yup
    .string()
    .required()
    .matches(/^\+?\d{10,15}$/, "invalid phone number"),
});

const { auth } = storeToRefs(useAuthStore());

const router = useRouter();

const { mutate, isPending } = AuthService.edit();
const { mutate: mutatePhoto, isPending: isPendingPhoto } = AuthService.photo();
const inputRef = ref<HTMLInputElement>();

const {
  defineField,
  values,
  errors,
  handleSubmit,
  resetForm,
  setFieldValue,
  ...form
} = useForm<UserPublicPayload>({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    name: auth.value?.name,
    dob: auth.value?.dob,
    gender: auth.value?.gender,
    phone: auth.value?.phone,
  },
  validateOnMount: false,
});

defineField("name");
defineField("dob");
defineField("gender");
defineField("phone");

const handleChange = async (e: Event) => {
  if (!inputRef.value) return;
  const files = inputRef.value?.files;
  if (!files) return;
  const file = files[0];
  const formData = new FormData();
  formData.append("file", file);

  mutatePhoto(formData, {
    onSuccess: (res) => {
      auth.value = res.data.data;
      push("Sukses bro", { type: "success" });
    },
    onSettled: async () => {
      if (!inputRef.value) return;
      inputRef.value.type = "text";
      await nextTick();
      inputRef.value.type = "file";
    },
  });
};

const onSubmit = handleSubmit((value: UserPublicPayload) => {
  mutate(value, {
    onSuccess: (res) => {
      router.push(routes.profile);
      push("Edit profil sukses", { type: "success" });
    },
    onError: (err) => {
      push("Error bro", { type: "error" });
    },
  });
});

onMounted(() => {
  setTimeout(() => {
    resetForm({ errors: undefined });
  }, 3e2);
});
</script>

<template>
  <div class="flex flex-col">
    <CBarTitle :back="routes.profile">Edit Profil</CBarTitle>

    <div class="px-3">
      <CCardAlt content-class="decoration flex flex-col gap-2">
        <form class="flex flex-col gap-2" @submit.prevent="onSubmit()">
          <!-- <CInput v-model:value="values.name" label="Nama" /> -->

          <div class="flex justify-center">
            <input
              class="hidden"
              ref="inputRef"
              type="file"
              accept="image/*"
              @change="handleChange"
            />
            <div class="relative">
              <CAvatar
                class="shadow-card"
                :loading="isPendingPhoto"
                :src="auth?.user?.photo"
              />
              <CButton
                :disabled="isPending || isPendingPhoto"
                class="!absolute bottom-0 right-2 ring-2 ring-white"
                icon
                size="sm"
                @click="inputRef?.click()"
              >
                <Icon name="ri:pencil-fill" />
              </CButton>
            </div>
          </div>

          <CInput
            :value="values.name"
            :disabled="isPending"
            label="Nama"
            :is-invalid="errors.name !== undefined"
            :message="errors.name"
            @update:value="setFieldValue('name', $event)"
          />

          <CInput
            :value="auth?.user?.email"
            disabled
            label="Email"
            type="email"
          />

          <CInput
            :value="dayjs(values.dob).format('YYYY-MM-DD')"
            :disabled="isPending"
            label="Tanggal Lahir"
            type="date"
            :max="dayjs().format('YYYY-MM-DD')"
            :is-invalid="errors.dob !== undefined"
            :message="errors.dob"
            @update:value="setFieldValue('dob', new Date($event))"
          />

          <CSelect
            label="Jenis Kelamin"
            :disabled="isPending"
            placeholder="Pilih Jenis Kelamin"
            :items="Object.values(USER_PUBLIC_GENDER)"
            :is-invalid="errors.gender !== undefined"
            :message="errors.gender"
            :value="values.gender"
            @update:value="setFieldValue('gender', $event as UserPublicGender)"
          />

          <CInput
            :value="values.phone"
            :disabled="isPending"
            label="Telepon"
            type="tel"
            :is-invalid="errors.phone !== undefined"
            :message="errors.phone"
            @update:value="setFieldValue('phone', $event)"
          />

          <div class="flex justify-center gap-2">
            <CButton
              as="link"
              :disabled="isPending"
              :to="routes.profile"
              variant="light"
              color="light"
              type="submit"
              >Kembali</CButton
            >
            <CButton color="light" :loading="isPending" type="submit"
              >Simpan!</CButton
            >
          </div>
        </form>
      </CCardAlt>
    </div>
  </div>
</template>
