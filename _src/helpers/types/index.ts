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
