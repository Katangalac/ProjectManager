import { io, Socket } from "socket.io-client";

/**
 * Client socket-io pour faire du temps réel pour les messages, et autre
 */
export const socket: Socket = io("http://localhost:3000", {
  withCredentials: true,
});
