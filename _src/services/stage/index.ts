import type { UserStage, UserStageListParams } from "qhunt-lib";
import {
  request,
  type DefaultResponse,
  type DefaultResponseList,
} from "~/_src/helpers";

const path = {
  list: "/stage/list",
  detail: (id: string) => `/stage/${id}/detail`,
} as const;

export const list = (params?: Ref<Partial<UserStageListParams>>) => {
  return request.get<DefaultResponseList<UserStage>>(path.list, { params });
};

export const detail = (id: Ref<string>) => {
  const url = computed(() => path.detail(id.value));
  return request.get<DefaultResponse<UserStage>>(url);
};

const stage = { list, detail } as const;

export default stage;
