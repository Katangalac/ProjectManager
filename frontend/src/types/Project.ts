import { Pagination } from "./Pagination";
import { User } from "./User";

/**
 * Type représentant les status d'un projet
 */
export type ProjectStatus =
  | "BLOCKED"
  | "PLANNING"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED";

/**
 * Type représentant un projet
 */
export type Project = {
  id: string;
  creatorId: string | null;
  title: string;
  description: string;
  status: ProjectStatus;
  budgetPlanned: number;
  actualCost: number;
  progress: number;
  startedAt: Date;
  deadline: Date;
  completedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
};

export type ProjectWithRelation = Project & {
  user?: User;
};

/**
 * Type des données attendues lors de la création d'un projet
 */
export type CreateProjectData = {
  description: string;
  creatorId: string | null;
  title: string;
  status: ProjectStatus;
  startedAt: Date;
  deadline: Date;
  budgetPlanned: number;
  progress: number;
};

/**
 * Type représentant la structure des responses API pour une requte de recupération des projets
 */
export type ProjectsApiResponse = {
  data: Project[];
  success: boolean;
  pagination?: Pagination;
  message?: string;
};

/**
 * Type représentant la structure des responses API pour une requte de recupération d'un projet
 */
export type ProjectApiResponse = {
  data: ProjectWithRelation;
  success: boolean;
  pagination?: Pagination;
  message?: string;
};

/**
 * Type représentant la structure des responses API pour la requete de calcul du cout total d'un projet
 */
export type ProjectTotalCostApiResponse = {
  data: number;
  success: boolean;
  message?: string;
};

/**
 * Type des données attendues lors de la modification d'un projet
 */
export type UpdateProjectData = {
  creatorId?: string | null | undefined;
  title?: string | undefined;
  description?: string | undefined;
  status?: ProjectStatus | undefined;
  budgetPlanned?: number | undefined;
  progress?: number | undefined;
  actualCost?: number | undefined;
  startedAt?: Date | undefined;
  deadline?: Date | undefined;
  completedAt?: Date | null | undefined;
};

/**
 * Type des données attendues comme paramètre de recherche des projets
 */
export type SearchProjectsFilter = {
  page?: number | undefined;
  pageSize?: number | undefined;
  title?: string | undefined;
  status?: ProjectStatus | undefined;
  startOn?: Date | undefined;
  endOn?: Date | undefined;
  startBefore?: Date | undefined;
  endBefore?: Date | undefined;
  startAfter?: Date | undefined;
  progessEq?: number | undefined;
  progessLt?: number | undefined;
  progessGt?: number | undefined;
  endAfter?: Date | undefined;
  completedOn?: Date | undefined;
  completedBefore?: Date | undefined;
  completedAfter?: Date | undefined;
  all?: boolean | undefined;
};
