import {
  createProjectSchema,
  projectSchema,
  searchProjectsFilterSchema,
  updateProjectDataSchema,
} from "@/schemas/project.schemas";
import { z } from "zod";
import { Pagination } from "@/types/Pagination";

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

/**
 * Type représentant une liste des projets ainsi que les informations sur la pagination
 */
export type ProjectsCollection = {
  projects: Project[];
  pagination: Pagination;
};
