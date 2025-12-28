import { ProjectStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma pour valider la structure de base d'un objet projet
 */
export const projectSchema = z.object({
  id: z.uuid("ID invalide"),
  creatorId: z.uuid("ID invalide").nullable(),
  title: z.string().max(100, "Titre trop long"),
  description: z.string(),
  status: z.enum(ProjectStatus).default(ProjectStatus.PLANNING),
  budgetPlanned: z.float64().default(0.0),
  actualCost: z.float64().default(0.0),
  progress: z.number().int().min(0).max(100).default(0),
  startedAt: z.coerce.date(),
  deadline: z.coerce.date(),
  completedAt: z.coerce.date().nullable(),
  updatedAt: z.date(),
  createdAt: z.date(),
});

/**
 * Schéma pour valider les données attendues lors de la création d'un nouveau projet
 */
export const createProjectSchema = projectSchema.omit({
  id: true,
  actualCost: true,
  completedAt: true,
  updatedAt: true,
  createdAt: true,
});

/**
 * Schéma pour valider les données attendues lors de la modification d'un projet
 */
export const updateProjectDataSchema = z.object({
  creatorId: z.uuid("ID invalide").nullable().optional(),
  title: z.string().max(100, "Titre trop long").optional(),
  description: z.string().optional(),
  status: z.enum(ProjectStatus).optional(),
  budgetPlanned: z.float64().optional(),
  actualCost: z.float64().optional(),
  progress: z.number().int().min(0).max(100).optional(),
  startedAt: z.coerce.date().optional(),
  deadline: z.coerce.date().optional(),
  completedAt: z.coerce.date().nullable().optional(),
});

/**
 * Schéma pour valider les données attendues comme filtre de recherche des projets
 */
export const searchProjectsFilterSchema = z.object({
  title: z.string().max(100, "Titre trop long").optional(),
  status: z.enum(ProjectStatus).optional(),
  progressEq: z.coerce.number().int().min(0).max(100).optional(),
  progressLt: z.coerce.number().int().min(0).max(100).optional(),
  progessGt: z.coerce.number().int().min(0).max(100).optional(),
  startOn: z.coerce.date().optional(),
  endOn: z.coerce.date().optional(),
  startBefore: z.coerce.date().optional(),
  endBefore: z.coerce.date().optional(),
  startAfter: z.coerce.date().optional(),
  endAfter: z.coerce.date().optional(),
  completedOn: z.coerce.date().optional(),
  completedBefore: z.coerce.date().optional(),
  completedAfter: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  all: z
    .string()
    .transform((val) => {
      if (val === undefined) return undefined;
      if (val.toLowerCase() === "true") return true;
      if (val.toLowerCase() === "false") return false;
      throw new z.ZodError([
        {
          code: "custom",
          message: "Invalid boolean value for 'read'",
          path: ["read"],
        },
      ]);
    })
    .optional(),
});
