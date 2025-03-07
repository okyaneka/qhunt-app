import type { Stage } from "qhunt-lib";
import { API } from "~/_src/constants";
import {
  request,
  type DefaultResponseList,
  type ExtendedQueryOptions,
} from "~/_src/helpers";

export const useStageList = (
  options?: Partial<ExtendedQueryOptions<DefaultResponseList<Stage>>>
) => {
  return request.query(API.ADMIN_STAGE_LIST, options);
};
