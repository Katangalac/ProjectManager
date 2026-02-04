import { io, Socket } from "socket.io-client";
import { userStore } from "@/stores/userStore";

/**
 * Client socket-io pour faire du temps réel pour les messages, et autre
 */
export const socket: Socket = io(
  import.meta.env.VITE_SOCKET_SERVER_URL || "http://localhost:3000",
  {
    withCredentials: true,
    auth: {
      token: userStore.getState().token,
    },
  }
);

socket.on("connect", () => {
  console.log("🔌 Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🔌 Socket disconnected:", reason);
});
