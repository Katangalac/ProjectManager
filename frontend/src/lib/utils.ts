import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Task } from "@/types/Task";
import { Project } from "@/types/Project";

/**
 * Fait un merge dse styles css
 *
 * @param {ClassValue[]} inputs - la liste des styles css
 * @returns un style css fusionné et synchronisé
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Retourne le nombre de taches par status à partir d'une liste des taches
 *
 * @param {Task[]} tasks - la liste des taches
 * @returns le nombre de taches par status
 */
export const getTaskStats = (tasks: Task[]) => {
  return {
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    todo: tasks.filter((t) => t.status === "TODO").length,
    blocked: tasks.filter((t) => t.status === "BLOCKED").length,
  };
};

/**
 * Retourne le nombre de projets par status à partir d'une liste des projets
 *
 * @param {Project[]} projects - la liste des projets
 * @returns le nombre de projets par status
 */
export const getProjectStats = (project: Project[]) => {
  return {
    completed: project.filter((p) => p.status === "COMPLETED").length,
    active: project.filter((p) => p.status === "ACTIVE").length,
    paused: project.filter((p) => p.status === "PAUSED").length,
    planning: project.filter((p) => p.status === "PLANNING").length,
    blocked: project.filter((p) => p.status === "BLOCKED").length,
  };
};
