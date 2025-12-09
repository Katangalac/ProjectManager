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
  startedAt: Date;
  deadline: Date;
  completedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
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
  endAfter?: Date | undefined;
  completedOn?: Date | undefined;
  completedBefore?: Date | undefined;
  completedAfter?: Date | undefined;
  all?: boolean | undefined;
};
