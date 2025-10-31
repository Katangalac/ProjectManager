import {projectCreationSchema, projectSchema, projectSearchFiltersSchema, updateProjectInputSchema} from "../schemas/project.schema"
import { z } from "zod";

/**
 * Type représentant la structure d'un projet dans la BD
 */
export type Project = z.infer<typeof projectSchema>;

/**
 * Type représentant les données attendues lors de la création d'un nouveau projet
 */
export type CreateProjectInput = z.infer<typeof projectCreationSchema>; 

/**
 * Type représentant les données attendues lors de la modification d'un projet
 */
export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>; 

/**
 * Type repreésentant les données attendues comme filtre lors d'une recherche des projets
 */
export type SearchProjectFilterShema = z.infer<typeof projectSearchFiltersSchema>; 