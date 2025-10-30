import { z } from "zod";

/**
 * Schéma de validation pour une équipe
 * Vérifie que les données sont présentes et valides
 */
export const teamSchema = z.object({
    id: z.uuid("ID invalide"),
    leaderId: z.uuid("ID invalide").nullable(),
    name: z.string().max(50, "Nom trop long"),
    description: z.string(),
    updatedAt:z.date(),        
    createdAt:z.date()
});