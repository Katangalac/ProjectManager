import { Resend } from "resend";
import { z } from "zod";
import { sendEmailSchema } from "./email.schemas";

//Adresse email utilisé pour envoyer des emails avec Resend
const RESEND_MAIL = process.env.RESEND_DEFAULT_DEV_MAIL;

const RESEND_API_KEY = process.env.RESEND_API_KEY;

//Instance Resend
const resend = new Resend(RESEND_API_KEY);

/**
 * Envoi un email
 * @param {string} to - email du destinataire
 * @param {string} subject - objet de l'email
 * @param {string} html -  contenu de l'email écrit en html
 */
export const sendEmail = async (to: string, subject: string, html: string) => {
    const sendEmailData = sendEmailSchema.parse({ to, subject, html });
    await resend.emails.send({
        from: `ProjectManager <${RESEND_MAIL}>`,
        to: sendEmailData.to,
        subject: sendEmailData.subject,
        html: sendEmailData.html,
    });
};