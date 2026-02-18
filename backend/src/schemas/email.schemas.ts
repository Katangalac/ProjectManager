import { z } from "zod";

/**
 * Schéma pour valider les données nécessaires pour envoyer un email
 */
export const sendEmailSchema = z.object({
  to: z.email({ message: "L'adresse email du destinataire est invalide." }),
  subject: z.string().min(1, { message: "Le sujet ne peut pas être vide." }),
  html: z.string().min(1, { message: "Le contenu HTML est requis." }),
});

/**
 * Schéma pour valider les données nécessaire pour envoyer l'email d'accueil
 */
export const sendWelcomeEmailSchema = z.object({
  email: z.email({ message: "L'adresse email du destinataire est invalide." }),
  name: z.string().min(1, { message: "Le nom ne peut pas être vide." })
});
