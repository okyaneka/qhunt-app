import type { UserChallenge, UserChallengeParams } from "qhunt-lib";
import {
  request,
  type DefaultResponse,
  type DefaultResponseList,
} from "~/_src/helpers";

const path = {
  list: "/challenge/list",
  detail: (id: string) => `/challenge/${id}/detail`,
} as const;

export const list = (params: Ref<Partial<UserChallengeParams>>) => {
  return request.get<DefaultResponseList<UserChallenge>>(path.list, { params });
};

export const detail = (id: Ref<string>) => {
  const url = computed(() => path.detail(id.value));
  return request.get<DefaultResponse<UserChallenge>>(url);
};

const challenge = { list, detail } as const;

export default challenge;
