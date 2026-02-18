import { io, Socket } from "socket.io-client";

/**
 * Client socket-io pour faire du temps réel pour les messages, et autre
 */
export const socket: Socket = io(
  import.meta.env.VITE_SOCKET_SERVER_URL || "http://localhost:3000",
  {
    withCredentials: true,
    autoConnect: false,
    auth: (cb) => {
      cb({
        token: JSON.parse(sessionStorage.getItem("user-storage") ?? "null")?.state.token,
      });
    },
  }
);

socket.on("connect", () => console.log("Connected to server"));
socket.on("disconnect", (reason) => console.log("Disconnected:", reason));
socket.on("connect_error", (err) => console.log("Connection error:", err.message));

// ping => pour tests de connexion
// setInterval(() => {
//   socket.emit("ping");
// }, 5000);
