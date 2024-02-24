import { Namespace } from "socket.io";
import { SocketMiddleWare, WSIo, WSSocket } from "../type";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Socket, io } from "socket.io-client";
import useSocketIo, { SocketHookConfig } from "../hooks/useSocketIo";
type CreatedSocketReturnType<NS extends string = string> = {
  runSocket: (
    io: WSIo
  ) => Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
} & Record<
  `use${Capitalize<NS>}Socket`,
  <T extends Record<string, (...args: any[]) => void>>(
    config?: SocketHookConfig<T>
  ) => {
    socket: Socket<T, DefaultEventsMap> | undefined;
  }
>;
export function createSocket<NS extends string = string>(
  nameSpace: NS,
  caller: (
    io:
      | WSIo
      | Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    socket: WSSocket
  ) => void,
  middlewares?: SocketMiddleWare[]
): CreatedSocketReturnType<NS> {
  return {
    runSocket: (io: WSIo) => {
      const nsIO = io.of("/" + nameSpace);
      middlewares?.map((m) => {
        nsIO.use(m);
      });
      nsIO.on("connection", (socket) => {
        console.log("A user connected");
        caller(nsIO, socket);
        socket.on("disconnect", () => {
          console.log("A user disconnected");
        });
      });
      return nsIO;
    },
    ["use" + capitalize(nameSpace) + "Socket"]: <
      T extends Record<string, (...args: any[]) => void>
    >(
      config: SocketHookConfig<T>
    ) => useSocketIo("/" + nameSpace, config),
  } as CreatedSocketReturnType<NS>;
}

function capitalize(word: string) {
  return word.substring(0, 1).toUpperCase() + word.substring(1);
}
