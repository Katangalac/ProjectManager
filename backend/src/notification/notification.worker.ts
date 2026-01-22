import { Worker } from "bullmq";
import { redisConnection } from "../types/Redis";
import { sendNotification } from "./notification.services";
import { getIO } from "../socket/socket";

/**
 * Worker qui s'occupe d'envoyer les notifications dans la file de notifications
 * Travail en arrière plan
 */
export const notificationWorker = new Worker(
  "notificationQueue",
  async (job) => {
    try {
      const { userId, title, message } = job.data;

      const notification = await sendNotification({ userId, title, message });

      try {
        const io = getIO();
        io.to(userId).emit("new_notification", notification);
      } catch (wsError) {
        console.error("❌ WebSocket emit failed:", wsError);
      }

      console.log(`📧 Notification envoyée à l’utilisateur ${userId}`);
      return notification;
    } catch (err) {
      console.error("❌ Worker failed to process notification job:", err);
      throw err;
    }
  },
  { connection: redisConnection },
);
