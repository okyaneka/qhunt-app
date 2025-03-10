import type { Stage } from "qhunt-lib";
import { API } from "~/_src/constants";
import {
  request,
  type DefaultResponse,
  type DefaultResponseList,
  type ExtendedQueryOptions,
} from "~/_src/helpers";

export interface Qr {
  id: string;
  code: string;
  location: any;
}

export interface LocalStage {
  id: string;
  name: string;
  qr: Qr;
}

export interface Challenge {
  id: string;
  name: string;
  qr: Qr;
  type: string;
}

export interface Content {
  id: string;
  hint: string;
  qr: Qr;
}

export interface ChallnegeContent {
  challenge: Omit<Challenge, "qr">;
  contents: Content[];
}

type StageDetailQr = {
  stage: LocalStage;
  challenges: Challenge[];
  challnegeContents: ChallnegeContent[];
};

export const useStageList = (
  options?: Partial<ExtendedQueryOptions<DefaultResponseList<Stage>>>
) => {
  return request.query(API.ADMIN_STAGE_LIST, options);
};

export const useStageDetailQr = (
  id: string,
  options?: Partial<ExtendedQueryOptions<DefaultResponse<StageDetailQr>>>
) => {
  return request.query(API.ADMIN_STAGE_DETAIL_QR(id), options);
};
