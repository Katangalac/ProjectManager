import { ProjectStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma pour valider la structure de base d'un objet projet
 */
export const projectSchema = z.object({
    id:z.uuid("ID invalide"),
    creatorId: z.uuid("ID invalide").nullable(),
    title: z.string().max(100, "Titre trop long"),         
    description: z.string(),
    status: z.enum(ProjectStatus).default(ProjectStatus.PLANNING),        
    budgetPlanned: z.float64().default(0.00),
    actualCost:z.float64().default(0.00),     
    startedAt:z.date(),    
    deadline:z.date(),      
    completedAt:z.date().nullable(),
    updatedAt:z.date(),
    createdAt:z.date()
});

/**
 * Schéma pour valider les données attendues lors de la création d'un nouveau projet
 */
export const projectCreationSchema = projectSchema.omit({
    id: true,
    completedAt: true,
    updatedAt: true,
    createdAt: true
});

/**
 * Schéma pour valider les données attendues lors de la modification d'un projet
 */
export const updateProjectInputSchema = z.object({
    creatorId: z.uuid("ID invalide").nullable().optional(),
    title: z.string().max(100, "Titre trop long").optional(),         
    description: z.string().optional(),
    status: z.enum(ProjectStatus).default(ProjectStatus.PLANNING).optional(),        
    budgetPlanned: z.float64().default(0.00).optional(),
    actualCost:z.float64().default(0.00).optional,     
    startedAt:z.date().optional(),    
    deadline:z.date().optional(),      
    completedAt:z.date().nullable().optional()
});

/**
 * Schéma pour valider les données attendues comme filtre de recherche des projets
 */
export const projectSearchFiltersSchema = z.object({
    title: z.string().max(100, "Titre trop long").optional(),
    status: z.enum(ProjectStatus).default(ProjectStatus.PLANNING).optional(),
    startOn:z.date().optional(),    
    endOn: z.date().optional(),
    startBefore: z.date().optional(),
    endBefore: z.date().optional(),
    startAfter: z.date().optional(),
    endAfter: z.date().optional(),
    completedOn: z.date().optional(),
    completedBefore: z.date().optional(),
    completedAfter:z.date().optional(),
});

