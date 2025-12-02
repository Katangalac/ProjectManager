import type { Pagination } from "./Pagination";

export type ProjectStatus =
  | "BLOCKED"
  | "PLANNING"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED";

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

export type CreateProjectData = {
  description: string;
  creatorId: string | null;
  title: string;
  status: ProjectStatus;
  startedAt: Date;
  deadline: Date;
  budgetPlanned: number;
};

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

export type SearchProjectsFilter = {
  page: number;
  pageSize: number;
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

export type ProjectsCollection = {
  projects: Project[];
  pagination: Pagination;
};
