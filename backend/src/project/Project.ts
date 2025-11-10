import { createProjectSchema, projectSchema, searchProjectsFilterSchema, updateProjectDataSchema } from "./project.schemas";
import { z } from "zod";

/**
 * Type représentant la structure d'un projet dans la BD
 */
export type Project = z.infer<typeof projectSchema>;

/**
 * Type représentant les données attendues lors de la création d'un nouveau projet
 */
export type CreateProjectData = z.infer<typeof createProjectSchema>; 

/**
 * Type représentant les données attendues lors de la modification d'un projet
 */
export type UpdateProjectData = z.infer<typeof updateProjectDataSchema>; 

/**
 * Type repreésentant les données attendues comme filtre lors d'une recherche des projets
 */
export type SearchProjectsFilter = z.infer<typeof searchProjectsFilterSchema>; 