import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketMiddleWare } from "../type";
import jwt from "jsonwebtoken";

export const withSocketAuth: SocketMiddleWare = (socket, next) => {
  if (socket.handshake.auth.token) {
    const token = socket.handshake.auth.token;

    if (!token || !process.env.SECRET) {
      return next(new Error("Authentication error"));
    }

    // Implement your authentication logic here
    // For example, validate a session token or JWT from the cookies
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      (socket.request as any).user = decoded;
      return next();
    } catch (error) {
      return next(new Error("Authentication error"));
    }
  }
  next(new Error("Authentication error"));
};
