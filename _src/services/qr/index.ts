import type { QrContent } from "qhunt-lib/models/QrModel";
import { request, type DefaultResponse } from "~/_src/helpers";

const path = {
  verify: (code: string) => `/qr/verify/${code}`,
} as const;

export const verify = (code: Ref<string>) => {
  const url = computed(() => path.verify(code.value));
  return request.get<DefaultResponse<QrContent>>(url, {
    enabled: false,
    retry: 0,
  });
};

const qr = { verify } as const;

export default qr;
