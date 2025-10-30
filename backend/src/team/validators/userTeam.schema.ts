import { z } from "zod"

/**
 * Schéma de validation pour les paramètres d'entrée lors d'une mise à jour des informations
 * d'une équipe
 * Vérifie que les données sont présentes et valides
 */
export const userTeamSchema = z.object({
    userId: z.uuid("ID invalide"),
    teamId: z.uuid("ID invalide"),
    userRole: z.string(),
    createdAt: z.date(),
    updatedAt:z.date()
});