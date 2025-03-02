<script setup lang="ts">
import { push } from "~/_src/helpers/toast";
import { toTypedSchema } from "@vee-validate/yup";
import { useForm, type YupSchema } from "vee-validate";
import * as yup from "yup";
import type { UserPasswordPayload, UserPayload } from "qhunt-lib";
import { routes } from "~/_src/helpers";
import AuthService from "~/_src/services/auth-service";
import { setTitle } from "~/_src/helpers/common";

setTitle("Update Password");
definePageMeta({
  middleware: "auth",
  layout: "mobile",
});

const router = useRouter();
const { data: user } = AuthService.me();
const { mutate, isPending } = AuthService.password();

const hasOldPassword = computed(() =>
  user.value?.data.user?.provider.includes("email")
);

const schema = computed(() => {
  const obj = {
    old_password: hasOldPassword.value
      ? yup.string().min(8).required()
      : yup.string().min(8).nullable().default(null),
    new_password: yup
      .string()
      .min(8)
      .required()
      .notOneOf([yup.ref("old_password")]),
    confirm_password: yup
      .string()
      .min(8)
      .required()
      .oneOf([yup.ref("new_password")]),
  };

  return yup.object(obj);
});

const {
  defineField,
  values,
  errors,
  handleSubmit,
  resetForm,
  setFieldValue,
  ...form
} = useForm<UserPasswordPayload>({
  validationSchema: toTypedSchema(schema.value),
  validateOnMount: false,
});

defineField("old_password");
defineField("new_password");
defineField("confirm_password");

const onSuccess = () => {
  router.push(routes.login);
  push("Berhasil Ubah Password. Login lagi yuk!", {
    type: "success",
    duration: 5e3,
  });
};

const onSubmit = handleSubmit((value: UserPasswordPayload) => {
  mutate(value, { onSuccess });
});
</script>

<template>
  <div class="flex flex-col">
    <CBarTitle>Update Password</CBarTitle>

    <div class="px-3">
      <CCardAlt content-class="decoration flex flex-col gap-2">
        <form class="flex flex-col gap-2" @submit.prevent="onSubmit()">
          <!-- <CInput v-model:value="values.name" label="Nama" /> -->

          <CInput
            v-if="hasOldPassword"
            :value="values.old_password"
            :disabled="isPending"
            label="Password Lama"
            type="password"
            toggle-password
            :is-invalid="errors.old_password !== undefined"
            :message="errors.old_password"
            @update:value="setFieldValue('old_password', $event)"
          />

          <CInput
            :value="values.new_password"
            :disabled="isPending"
            label="Password Baru"
            type="password"
            toggle-password
            :is-invalid="errors.new_password !== undefined"
            :message="errors.new_password"
            @update:value="setFieldValue('new_password', $event)"
          />

          <CInput
            :value="values.confirm_password"
            :disabled="isPending"
            label="Konfirmasi Password"
            type="password"
            toggle-password
            :is-invalid="errors.confirm_password !== undefined"
            :message="errors.confirm_password"
            @update:value="setFieldValue('confirm_password', $event)"
          />

          <div class="flex gap-2 justify-center">
            <CButton color="light" :disabled="isPending" variant="light"
              >Kembali</CButton
            >
            <CButton color="light" :loading="isPending" type="submit"
              >Simpan</CButton
            >
          </div>
        </form>
      </CCardAlt>
    </div>
  </div>
</template>
