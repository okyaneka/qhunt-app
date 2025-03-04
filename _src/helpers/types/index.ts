import type { ValueOf } from "qhunt-lib";
import type { HTMLAttributes } from "vue";
import type { RouterLinkProps } from "vue-router";
import type { API } from "~/_src/constants";

export type PartialDeep<T> = {
  [K in keyof T]?: T[K] extends Array<infer I>
    ? I extends Record<string, any>
      ? PartialDeep<I>[]
      : I[]
    : T[K] extends Record<string, any>
    ? PartialDeep<T[K]>
    : T[K];
};

export type CommonWpmOptions = {
  speed: number;
  buffer: number;
};
export type SocketCallback = (...arg: any[]) => void;
export type SocketCallbackError = (error: Error) => void;
export type SocketStatus = "connecting" | "connected" | "disconnected";
export type DefaultResponse<T = unknown> = {
  code: number;
  message: string;
  data: T;
  error: any;
};
export type DefaultResponseList<T> = DefaultResponse<{
  list: T[];
  page: number;
  totalItems: number;
  totalPages: number;
}>;
/**
 *  "default" | "success" | "info" | "warning" | "error"
 */
export type Type = "default" | "success" | "info" | "warning" | "error";
export type MutationMethod =
  | "delete"
  | "DELETE"
  | "patch"
  | "PATCH"
  | "post"
  | "POST"
  | "put"
  | "PUT";

export type ListItem<T = Record<string, any>> = T &
  Partial<
    { class: HTMLAttributes["class"]; as: "link" | "button" } & RouterLinkProps
  >;

export type Api = ValueOf<typeof API>;

export type SliderItem = {
  title: string;
  subtitle?: string;
  image?: string;
  to?: RouterLinkProps["to"];
};
