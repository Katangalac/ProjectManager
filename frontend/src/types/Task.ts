import { Project } from "./Project";
import { Team } from "./Team";
import { User } from "./User";

/**
 * Type représentant une tache
 */
export type Task = {
  id: string;
  creatorId: string | null;
  projectId: string | null;
  teamId: string | null;
  title: string;
  description: string;
  priorityLevel: number;
  status: TaskStatus;
  cost: number;
  progress: number;
  startedAt: Date;
  deadline: Date;
  completedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
};

/**
 * Type représentant une tache avec ses différentes relations
 */
export type TaskWithRelations = Task & {
  project?: Project | null;
  team?: Team | null;
  assignedTo?: {
    user: User;
  }[];
};

/**
 * Type représentant les status d'une tache
 */
export type TaskStatus = "TODO" | "IN_PROGRESS" | "BLOCKED" | "COMPLETED";

export type CreateTaskData = {
  description: string;
  teamId: string | null;
  creatorId: string | null;
  projectId: string | null;
  title: string;
  priorityLevel: number;
  status: TaskStatus;
  cost: number;
  startedAt: Date;
  deadline: Date;
};

/**
 * Type des données attendues lors de la modification d'une tache
 */
export type UpdateTaskData = {
  creatorId?: string | null | undefined;
  projectId?: string | null | undefined;
  teamId?: string | null | undefined;
  title?: string | undefined;
  description?: string | undefined;
  priorityLevel?: number | undefined;
  progress?: number | undefined;
  status?: TaskStatus | undefined;
  cost?: number | undefined;
  startedAt?: Date | undefined;
  deadline?: Date | undefined;
  completedAt?: Date | undefined;
};

/**
 * Type des données attendues comme paramètre de recherche des taches
 */
export type SearchTasksFilter = {
  page?: number | undefined;
  pageSize?: number | undefined;
  title?: string | undefined;
  priorityLevelEq?: number | undefined;
  priorityLevelLt?: number | undefined;
  priorityLevelGt?: number | undefined;
  progressEq?: number | undefined;
  progressLt?: number | undefined;
  progressGt?: number | undefined;
  status?: TaskStatus | undefined;
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
