import { TaskStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma pour valider la structure de base d'une tâche dans la BD
 */
export const taskSchema = z.object({
    id : z.uuid("ID invalide"),
    creatorId : z.uuid("ID invalide").nullable(),    
    projectId : z.uuid("ID invalide").nullable(),    
    teamId : z.uuid("ID invalide").nullable(),
    title : z.string(),
    description : z.string(),
    priorityLevel: z.number().int().min(0).max(5),
    status : z.enum(TaskStatus).default("TODO"),
    cost : z.float64().default(0.00),        
    startedAt : z.coerce.date(),
    deadline : z.coerce.date(),
    completedAt : z.coerce.date().nullable(),
    updatedAt : z.date(),     
    createdAt : z.date()   
});

/**
 * Schéma pour valider les données attendues lors de la création d'une nouvelle tâche
 */
export const createTaskSchema = taskSchema.omit({
    id: true,
    completedAt: true,
    updatedAt: true,
    createdAt: true
});

/**
 * Schéma pour valider les données attendues lors de la modification d'une tâche
 */
export const updateTaskDataSchema = z.object({
    creatorId: z.uuid("ID invalide").nullable().optional(),
    projectId : z.uuid("ID invalide").nullable().optional(),    
    teamId : z.uuid("ID invalide").nullable().optional(),
    title: z.string().optional(),         
    description : z.string().optional(),
    priorityLevel: z.number().int().min(0).max(5).optional(),
    status : z.enum(TaskStatus).optional(),
    cost : z.float64().optional(),        
    startedAt : z.coerce.date().optional(),
    deadline : z.coerce.date().optional(),
    completedAt : z.coerce.date().optional()
});

/**
 * Schéma pour valider les données attendues comme filtre de recherche des taches
 */
export const searchTasksFilterSchema = z.object({
    title: z.string().optional(),
    priorityLevelEq: z.coerce.number().int().min(0).max(5).optional(),
    priorityLevelLt: z.coerce.number().int().min(0).max(5).optional(),
    priorityLevelGt: z.coerce.number().int().min(0).max(5).optional(),
    status: z.enum(TaskStatus).optional(),
    startOn:z.coerce.date().optional(),    
    endOn: z.coerce.date().optional(),
    startBefore: z.coerce.date().optional(),
    endBefore: z.coerce.date().optional(),
    startAfter: z.coerce.date().optional(),
    endAfter: z.coerce.date().optional(),
    completedOn: z.coerce.date().optional(),
    completedBefore: z.coerce.date().optional(),
    completedAfter: z.coerce.date().optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20)
});