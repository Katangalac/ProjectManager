import { Queue } from "bullmq";
import { redisConnection } from "../types/Redis";

/**
 * File de notifications. Enfile les notifications à envoyer
 * Les notifications de la file seront ensuite envoyés par un worker
 */
export const notificationQueue = new Queue("notificationQueue", {
  connection: redisConnection,
});

/**
 * Ajoute une notification dans la file pour traitement asynchrone
 * @param userId - identifiant de l'utilisateur concerné
 * @param title - titre de la notification
 * @param message - message de la notification
 */
export const addNotificationToQueue = async (
  userId: string,
  title: string,
  message: string
) => {
  await notificationQueue.add("sendNotification", {
    userId,
    title,
    message,
  });
};
