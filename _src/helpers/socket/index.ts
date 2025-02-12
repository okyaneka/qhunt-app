import {
  io,
  type ManagerOptions,
  type Socket,
  type SocketOptions,
} from "socket.io-client";
import { useEnv } from "~/_src/configs/env";
import type {
  SocketCallback,
  SocketCallbackError,
  SocketStatus,
} from "../types";
import dayjs from "dayjs";
import toast from "../toast";

type LocalOptions = {
  ping: boolean;
  manual: boolean;
};

const env = useEnv();

export const namespace = {
  leaderboard: "/leaderboard",
  challenge: "/challenge",
  trivia: "/trivia",
} as const;

export const useSocket = (
  namespace: string = "/",
  opts?: MaybeRef<Partial<ManagerOptions & SocketOptions & LocalOptions>>,
  ops?: (socket: Socket) => void | Promise<void>
) => {
  const optsRef = toRef(opts);
  const socket = ref<Socket>();
  const status = ref<SocketStatus>("connecting");
  const ping = ref(0);
  const pingTime = ref();

  const connectCallback = ref<SocketCallback>();
  const connectErrorCallback = ref<SocketCallbackError>();
  const disconnectCallback = ref<SocketCallback>();
  const reconnectCallback = ref<SocketCallback>();
  const reconnectFailedCallback = ref<SocketCallback>();
  const reconnectAttemptCallback = ref<SocketCallback>();
  const reconnectErrorCallback = ref<SocketCallbackError>();
  const errorCallback = ref<SocketCallbackError>();

  const onPing = () => {
    pingTime.value = dayjs().valueOf();
    socket.value?.emit("ping");
  };

  const onConnect = (callback: SocketCallback) =>
    (connectCallback.value = callback);

  const onConnectError = (callback: SocketCallbackError) =>
    (connectErrorCallback.value = callback);

  const onDisconnect = (callback: SocketCallback) =>
    (disconnectCallback.value = callback);

  const onReconnect = (callback: SocketCallback) =>
    (reconnectCallback.value = callback);

  const onReconnectAttempt = (callback: SocketCallback) =>
    (reconnectAttemptCallback.value = callback);

  const onReconnectError = (callback: SocketCallbackError) =>
    (reconnectErrorCallback.value = callback);

  const onReconnectFailed = (callback: SocketCallback) =>
    (reconnectFailedCallback.value = callback);

  const onError = (callback: SocketCallbackError) =>
    (errorCallback.value = callback);

  const connect = () => {
    socket.value?.disconnect();

    socket.value = io(`${env.APP_SOCKET_URL}${namespace}`, {
      withCredentials: true,
      path: "/socket",
      ...optsRef.value,
    });

    socket.value.on("pong", () => {
      ping.value = dayjs().valueOf() - pingTime.value;
    });

    socket.value.on("connect", () => {
      status.value = "connected";
      connectCallback.value && connectCallback.value();
    });

    socket.value.on("connect_error", (error: Error) => {
      status.value = "disconnected";
      console.error(error);
      connectErrorCallback.value && connectErrorCallback.value(error);
    });

    socket.value.on("error", (error: any) => {
      console.error(error);
      // toast.push(error, { type: "error" });
      errorCallback.value && errorCallback.value(error);
    });

    socket.value.on("disconnect", (reason) => {
      status.value = "disconnected";
      disconnectCallback.value && disconnectCallback.value(reason);
    });

    socket.value.io.on("reconnect_attempt", (attempt) => {
      status.value = "connecting";
      reconnectAttemptCallback.value && reconnectAttemptCallback.value(attempt);
    });

    socket.value.io.on("reconnect_error", (error: Error) => {
      status.value = "disconnected";
      console.error(error);
      reconnectErrorCallback.value && reconnectErrorCallback.value(error);
    });

    socket.value.io.on("reconnect", () => {
      status.value = "connected";
      reconnectCallback.value && reconnectCallback.value();
    });

    socket.value.io.on("reconnect_failed", () => {
      status.value = "disconnected";
      reconnectFailedCallback.value && reconnectFailedCallback.value();
    });

    if (optsRef.value?.ping) {
      onNuxtReady(() => {
        setInterval(() => {
          onPing();
        }, 3e3);
      });
    }

    ops && ops(socket.value);
  };

  // socket.value.io.on("error", (error: Error) => {
  //   console.error(error.message);
  //   errorCallback.value && errorCallback.value(error);
  // });

  watch(
    optsRef,
    () => {
      if (!optsRef.value?.manual) connect();
    },
    { deep: true, immediate: true }
  );

  return {
    socket,
    status,
    ping,
    connect,
    onConnect,
    onConnectError,
    onDisconnect,
    onReconnectAttempt,
    onReconnectError,
    onReconnect,
    onReconnectFailed,
    onError,
  };
};

const socket = { ...namespace, useSocket };

export default socket;
