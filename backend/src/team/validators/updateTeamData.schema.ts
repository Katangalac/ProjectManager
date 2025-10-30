import { z } from "zod"

/**
 * Schéma de validation pour les paramètres d'entrée lors d'une mise à jour des informations
 * d'une équipe
 * Vérifie que les données sont présentes et valides
 */
export const updateTeamDataSchema = z.object({
    leaderId: z.uuid("ID invalide").nullable().optional(),
    name: z.string().max(50, "Nom trop long").optional(),
    description: z.string().optional()
});