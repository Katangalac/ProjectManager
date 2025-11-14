import type { Pagination } from "./Pagination";

export type Task = {
    id: string;
    creatorId: string | null;
    projectId: string | null;
    teamId: string | null;
    title: string;
    description: string;
    priorityLevel: number;
    status: "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "CANCELLED";
    cost: number;
    startedAt: Date;
    deadline: Date;
    completedAt: Date | null;
    updatedAt: Date;
    createdAt: Date;
};

export type CreateTaskData = {
    description: string;
    teamId: string | null;
    creatorId: string | null;
    projectId: string | null;
    title: string;
    priorityLevel: number;
    status: "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "CANCELLED";
    cost: number;
    startedAt: Date;
    deadline: Date;
};

export type UpdateTaskData = {
    creatorId?: string | null | undefined;
    projectId?: string | null | undefined;
    teamId?: string | null | undefined;
    title?: string | undefined;
    description?: string | undefined;
    priorityLevel?: number | undefined;
    status?: "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "CANCELLED" | undefined;
    cost?: number | undefined;
    startedAt?: Date | undefined;
    deadline?: Date | undefined;
    completedAt?: Date | undefined;
};

export type SearchTasksFilter = {
    page: number;
    pageSize: number;
    title?: string | undefined;
    priorityLevelEq?: number | undefined;
    priorityLevelLt?: number | undefined;
    priorityLevelGt?: number | undefined;
    status?: "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "CANCELLED" | undefined;
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

export type TasksCollection = {
    tasks: Task[],
    pagination: Pagination
};

