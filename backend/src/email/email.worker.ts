import { Worker } from "bullmq";
import { redisConnection } from "../types/Redis";
import { sendEmail } from "./email.services";

/**
 * Worker qui s'occupe d'envoyer les emails dans la file d'emails
 * Travail en arrière plan
 */
new Worker(
  "emailQueue",
  async (job) => {
    const { to, subject, html } = job.data;
    await sendEmail(to, subject, html);
    console.log("📧 Email envoyé à", to);
  },
  { connection: redisConnection }
);