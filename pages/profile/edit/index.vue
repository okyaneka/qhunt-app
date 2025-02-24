<script setup lang="ts">
import { push } from "~/_src/helpers/toast";
import { routes } from "~/_src/helpers";
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import * as yup from "yup";
// import auth from "~/_src/services/auth";
import {
  USER_PUBLIC_GENDER,
  type UserPublicGender,
  type UserPublicPayload,
} from "qhunt-lib/types";
import dayjs from "dayjs";
import AuthService from "~/_src/services/auth";

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

const { auth } = useAuthStore();
const router = useRouter();

const { mutate, isPending } = AuthService.edit();

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
    name: auth?.name,
    dob: auth?.dob,
    gender: auth?.gender,
    phone: auth?.phone,
  },
  validateOnMount: false,
});

defineField("name");
defineField("dob");
defineField("gender");
defineField("phone");

const onSubmit = handleSubmit((value: UserPublicPayload) => {
  console.log(value);
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

          <CInput
            :value="values.name"
            label="Nama"
            prepend-icon="ri:user-line"
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
            label="Tanggal Lahir"
            type="date"
            :max="dayjs().format('YYYY-MM-DD')"
            :is-invalid="errors.dob !== undefined"
            :message="errors.dob"
            @update:value="setFieldValue('dob', new Date($event))"
          />

          <CSelect
            label="Jenis Kelamin"
            placeholder="Pilih Jenis Kelamin"
            :items="Object.values(USER_PUBLIC_GENDER)"
            :is-invalid="errors.gender !== undefined"
            :message="errors.gender"
            :value="values.gender"
            @update:value="setFieldValue('gender', $event as UserPublicGender)"
          />

          <CInput
            :value="values.phone"
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
