import { apiUrl, useApi } from "@/hooks/useApi";
import { SafeUser } from "@/models/auth";
import simpleSocket from "@/server/sockets/simpleSocket";
import { withAuth } from "@/utils/withAuth";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export const getServerSideProps = withAuth({
  redirect: "/login",
});
export default function Home({ user }: { user: SafeUser }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-2">
      logged
      <div className="flex w-full justify-evenly">
        <ButtonSend id={1} sendTo={0}></ButtonSend>
        <ButtonSend id={0} sendTo={1}></ButtonSend>
      </div>
    </div>
  );
}
const ButtonSend = ({ sendTo, id }: { id: number; sendTo: number }) => {
  const [message, setMessage] = useState("");
  const { socket } = simpleSocket.useSimpleSocket({
    withAuth: true,
    on: {
      onSimpleRecieve: ({ m, sendTo }) => {
        if (id === sendTo) setMessage(m);
      },
    },
  });
  return (
    <div
      className="flex cursor-pointer flex-col items-center"
      onClick={() => socket?.emit("onSimple", { m: "ok", sendTo })}
    >
      <div>{message ? "recieved" : "-"}</div>
      <div>Send</div>
    </div>
  );
};
