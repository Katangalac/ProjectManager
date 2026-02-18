import { Queue } from "bullmq";
import { redisConnection } from "../redis/redis";

/**
 * File d'emails. Enfile les emails à envoyer
 * Les emails de la file seront ensuite envoyés par un worker
 */
export const emailQueue = new Queue("emailQueue", {
  connection: redisConnection,
});

/**
 * Ajoute un email dans la file pour traitement asynchrone
 * @param to - email du destinataire
 * @param subject - objet de l'email
 * @param html - contenu de l'email en html
 */
export const addEmailToQueue = async (
  to: string,
  subject: string,
  html: string,
) => {
  await emailQueue.add("sendEmail", {
    to,
    subject,
    html,
  });
};
