import { instrument } from "@socket.io/admin-ui";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import simpleSocket from "./sockets/simpleSocket";
dotenv.config();

const server = http.createServer((req, res) => {
  // Handle HTTP requests if needed
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

simpleSocket.runSocket(io);

server.listen(46371, () => {
  console.log("WebSocket server listening on port 46371");
});

instrument(io, { auth: false });
