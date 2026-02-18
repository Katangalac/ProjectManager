import { Request, Response } from "express";
import { addEmailToQueue } from "@/lib/bullmq/email.queue";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import { sendWelcomeEmailSchema } from "@/schemas/email.schemas";
import { z } from "zod";

/**
 * Envoi un email d'accueil
 * @param {Request} req - requete Express
 * @param {Response} res - réponse Express en JSON
 */
export const sendWelcomeEmail = async (req: Request, res: Response) => {
  try {
    const { email, name } = sendWelcomeEmailSchema.parse(req.body);
    const html = `<h2>Bienvenue ${name} 👋</h2><p>Merci de rejoindre ProjectManager 🚀</p>`;

    await addEmailToQueue(email, "Bienvenue sur ProjectManager", html);

    res.status(200).json(successResponse(null, "Email en file d’attente"));
  } catch (err) {
    console.error("Erreur lors de l’envoi d’e-mail :", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de l’envoi d’e-mail",
        ),
      );
  }
};
