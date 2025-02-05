import type { Qr, QrContent, QrListParams } from "qhunt-lib";
import {
  request,
  type DefaultResponse,
  type DefaultResponseList,
} from "~/_src/helpers";

const path = {
  list: `/admin/qr/list`,
  verify: (code: string) => `/qr/verify/${code}`,
} as const;

export const list = (params: Ref<Partial<QrListParams> | undefined>) => {
  return request.get<DefaultResponseList<Qr>>(path.list, {
    queryKey: [path.list, params],
    params,
  });
};

export const verify = (code: Ref<string>) => {
  const url = computed(() => path.verify(code.value));
  return request.get<DefaultResponse<QrContent>>(url, {
    enabled: false,
    retry: 0,
  });
};

const qr = { verify, list } as const;

export default qr;
