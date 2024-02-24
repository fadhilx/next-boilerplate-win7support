import { Server, Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
export type WSIo = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;
export type WSSocket = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;
export type WSSocketFn = (io: WSIo, socket: WSSocket) => void;
export type WSCallbackParam<T = any> = {
  io: WSIo;
  socket: WSSocket;
  message: T;
  eventName: string;
};
export type WSCallback = {
  permission: string[];
  callback: (s: WSCallbackParam) => void;
};
export type ConfigType = {
  onConnect: () => void;
  onDisconnect: () => void;
  custom: {
    [x: string]: WSCallback;
  };
};

export type SocketMiddleWare = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  next: (err?: ExtendedError | undefined) => void
) => void;
