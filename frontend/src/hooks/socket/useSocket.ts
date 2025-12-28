import { useEffect } from "react";
import { socket } from "@/lib/socket/socketClient";

export function useSocket<T>(event: string, handler: (data: T) => void) {
  useEffect(() => {
    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [event, handler]);
}
