import { Worker } from "bullmq";
import { redisConnection } from "../types/Redis";
import { sendNotification } from "./notification.services";
import { getIO } from "../chat/chat.socket";

/**
 * Worker qui s'occupe d'envoyer les notifications dans la file de notifications
 * Travail en arrière plan
 */
export const notificationWorker = new Worker(
  "notificationQueue",
  async (job) => {
      const { userId, title, message } = job.data;
      const io = getIO();
      const notification = await sendNotification({ userId, title, message });
      io.to(userId).emit("new_notification", notification);
    console.log(`📧 Notification envoyée à l’utilisateur ${userId}`);
  },
  { connection: redisConnection }
);

