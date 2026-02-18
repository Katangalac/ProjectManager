import { Worker } from "bullmq";
import { redisConnection } from "@/lib/redis/redis";
import { sendEmail } from "@/services/email.services";

/**
 * Worker qui s'occupe d'envoyer les emails dans la file d'emails
 * Travail en arrière plan
 */
export function startEmailWorker() {
  console.log("##Email worker started");
  new Worker(
    "emailQueue",
    async (job) => {
      const { to, subject, html } = job.data;
      await sendEmail(to, subject, html);
      console.log("##Email envoyé à", to);
    },
    { connection: redisConnection },
  );
}
