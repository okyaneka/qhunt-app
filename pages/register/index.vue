<script setup lang="ts">
import { push } from "~/_src/helpers/toast";
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import * as yup from "yup";
import auth from "~/_src/services/auth-service";
import type { UserPayload } from "qhunt-lib";
import { routes } from "~/_src/helpers";
import { setTitle } from "~/_src/helpers/common";

setTitle("Register");
definePageMeta({
  middleware: "no-auth",
  layout: "blank",
});

const schema = yup.object({
  name: yup.string().required().default(""),
  email: yup.string().email().required().default(""),
  password: yup.string().min(8).required().default(""),
});

const router = useRouter();

const { mutate } = auth.register();

const {
  defineField,
  values,
  errors,
  handleSubmit,
  resetForm,
  setFieldValue,
  ...form
} = useForm<UserPayload>({
  validationSchema: toTypedSchema(schema),
  validateOnMount: false,
});

defineField("email");
defineField("name");
defineField("password");

const onSubmit = handleSubmit((value: UserPayload) => {
  mutate(value, {
    onSuccess: (res) => {
      router.push(routes.profile);
      push("Register Sukses!", { type: "success" });
    },
    onError: (err) => {
      // push("Error bro", { type: "error" });
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
  <div class="flex flex-col -translate-y-7">
    <CBarTitle>Daftar Dulu Yuk!</CBarTitle>

    <div class="px-3">
      <CCardAlt content-class="decoration flex flex-col gap-2">
        <div class="text-center">Kamu juga bisa daftar dengan:</div>
        <div class="flex justify-center gap-2">
          <CButton
            color="white"
            disabled
            bordered
            prepend-icon="logos:tiktok-icon"
          >
            TikTok
          </CButton>
          <CButton
            color="white"
            bordered
            prepend-icon="logos:google-icon"
            @click="resetForm()"
          >
            Google
          </CButton>
        </div>
        <hr />

        <form class="flex flex-col gap-2" @submit.prevent="onSubmit()">
          <!-- <CInput v-model:value="values.name" label="Nama" /> -->

          <CInput
            :value="values.name"
            label="Nama"
            :is-invalid="errors.name !== undefined"
            :message="errors.name"
            @update:value="setFieldValue('name', $event)"
          />

          <CInput
            :value="values.email"
            label="Email"
            type="email"
            :is-invalid="errors.email !== undefined"
            :message="errors.email"
            @update:value="setFieldValue('email', $event)"
          />

          <CInput
            :value="values.password"
            label="Password"
            type="password"
            toggle-password
            :is-invalid="errors.password !== undefined"
            :message="errors.password"
            @update:value="setFieldValue('password', $event)"
          />

          <div class="flex justify-center">
            <CButton color="light" type="submit">Daftar!</CButton>
          </div>

          <div class="text-center">
            Sudah punya akun?
            <RouterLink :to="routes.login">Login</RouterLink>
          </div>
        </form>
      </CCardAlt>
    </div>
  </div>
</template>
