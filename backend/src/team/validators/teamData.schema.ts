import { z } from "zod";

/**
 * Schéma de validation pour une équipe
 * Vérifie que les données sont présentes et valides
 */
export const teamDataSchema = z.object({
    leaderId: z.uuid("ID invalide").nullable(),
    name: z.string().max(50, "Nom trop long"),
    description: z.string()
});