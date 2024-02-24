import { WSIo, WSSocket } from "../type";
import { createSocket } from ".";
import { withSocketAuth } from "../middleware/withSocketAuth";
export default createSocket(
  "simple",
  (io, socket) => {
    const eventName = "onSimple";
    const recieverName = eventName + "Recieve";
    io.on(eventName, (message) => {
      socket.broadcast.emit(recieverName, message);
    });
  },
  [withSocketAuth]
);
