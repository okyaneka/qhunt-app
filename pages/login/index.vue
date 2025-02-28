<script setup lang="ts">
import { push } from "~/_src/helpers/toast";
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import * as yup from "yup";
import type { UserPayload } from "qhunt-lib";
import { routes } from "~/_src/helpers";
import AuthService from "~/_src/services/auth-service";
import { setTitle } from "~/_src/helpers/common";

setTitle("Login");
definePageMeta({
  middleware: "no-auth",
  layout: "blank",
});

const schema = yup.object({
  email: yup.string().email().required().default(""),
  password: yup.string().min(8).required().default(""),
});

const router = useRouter();

const { mutate: login, isPending } = AuthService.login();

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
defineField("password");

const onSubmit = handleSubmit((value: UserPayload) => {
  login(value, {
    onSuccess: () => {
      router.push(routes.profile);
      push("Register Sukses!", { type: "success" });
    },
  });
});
</script>

<template>
  <div class="flex flex-col -translate-y-7">
    <CBarTitle>Login Yuk!</CBarTitle>

    <div class="px-3">
      <CCardAlt content-class="decoration flex flex-col gap-2">
        <div class="text-center">Kamu juga bisa login dengan:</div>
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
            :value="values.email"
            :disabled="isPending"
            label="Email"
            type="email"
            :is-invalid="errors.email !== undefined"
            :message="errors.email"
            @update:value="setFieldValue('email', $event)"
          />

          <CInput
            :value="values.password"
            :disabled="isPending"
            label="Password"
            type="password"
            toggle-password
            :is-invalid="errors.password !== undefined"
            :message="errors.password"
            @update:value="setFieldValue('password', $event)"
          />

          <div class="flex justify-center">
            <CButton color="light" :loading="isPending" type="submit"
              >Login!</CButton
            >
          </div>
          <div class="text-center">
            Belum punya akun?
            <RouterLink :to="routes.register">Daftar lah!</RouterLink>
          </div>
        </form>
      </CCardAlt>
    </div>
  </div>
</template>
