import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

type SocketHookConfig<T> = {
  withAuth?: boolean;
  on?: T;
};

function useSocketIo<T extends Record<string, (...args: any[]) => void>>(
  namespace: string,
  config?: SocketHookConfig<T>
) {
  const { withAuth, on } = config || {};
  const [socket, setSocket] = useState<Socket<T, DefaultEventsMap>>();
  const timer = useRef<any>();
  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const token = withAuth
        ? (await axios.post("/api/auth/request-token")).data.token
        : undefined;
      const currentUrl = new URL(location.href);
      const newSocket = io(
        `${currentUrl.protocol}//${currentUrl.hostname}:46371${
          namespace.startsWith("/") ? namespace : "/" + namespace
        }`,
        withAuth
          ? {
              auth: { token },
            }
          : {}
      );
      if (on)
        Object.keys(on).map((e) => {
          newSocket.on(e, on[e]);
        });
      newSocket.on("connect_error", (m) => console.log("m", m));
      setSocket(newSocket);
    }, 200);
  }, []);
  return { socket };
}
export default useSocketIo;
