import { z } from "zod";

/**
 * Schéma de validation de la structure d'une équipe dans la BD
 * Vérifie que les données sont présentes et valides
 */
export const teamSchema = z.object({
    id: z.uuid("ID invalide"),
    leaderId: z.uuid("ID invalide").nullable(),
    name: z.string().max(50, "Nom trop long"),
    description: z.string(),
    updatedAt: z.date(),        
    createdAt: z.date()
});

/**
 * Schéma de validation des données attendues pour une équipe
 * Vérifie que les données sont présentes et valides
 */
export const createTeamSchema = teamSchema.omit({
    id: true,
    updatedAt: true,
    createdAt: true
});


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

/**
 * Schéma pour valider les données attendues comme filtre de recherche des équipes
 */
export const searchTeamsFilterSchema = z.object({
    name: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

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
    updatedAt: z.date()
});

/**
 * Schéma pour valider les données d'entrée d'une paire utilisateur-équipe
 */
export const addUserToTeamInputSchema = userTeamSchema.omit({
    teamId:true,
    createdAt: true,
    updatedAt: true
});

/**
 * Schéma pour le rôle de l'utilisateur dans une équipe
 */
export const userTeamRoleSchema = z.object({
    userRole: z.string()
});
