import {
  createTaskSchema,
  searchTasksFilterSchema,
  taskSchema,
  updateTaskDataSchema,
} from "../schemas/task.schemas";
import { z } from "zod";
import { Pagination } from "./Pagination";

/**
 * Type représentant la structure d'une tâche dans la BD
 */
export type Task = z.infer<typeof taskSchema>;

/**
 * Type représentant les données attendues lors de la création d'une nouvelle tache
 */
export type CreateTaskData = z.infer<typeof createTaskSchema>;

/**
 * Type représentant les données attendues lors de la modification d'une tache
 */
export type UpdateTaskData = z.infer<typeof updateTaskDataSchema>;

/**
 * Type représentant les données attendues comme filtre lors d'une recherche des taches
 */
export type SearchTasksFilter = z.infer<typeof searchTasksFilterSchema>;

/**
 * Type représentant une liste des tâches ainsi que les informations sur la pagination
 */
export type TasksCollection = {
  tasks: Task[];
  pagination: Pagination;
};
