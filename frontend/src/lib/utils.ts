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

/**
 * Retourne le nombre de taches complétées par mois d'un utilisateur
 * @param  {Task[]} tasks : la liste des taches de l'utilisateur
 * @returns la liste des taches complétées par mois
 */
export const getCompletedTasksPerMonth = (tasks: Task[]): number[] => {
  const months = new Array(12).fill(0);

  tasks.forEach((task) => {
    if (!task.completedAt) return;
    const date = new Date(task.completedAt);
    if (date.getFullYear() !== new Date().getFullYear()) return;
    const monthIndex = date.getMonth();
    months[monthIndex]++;
  });

  return months;
};

/**
 * Retourne le nombre de projets complétés par mois d'un utilisateur
 * @param  {Project[]} projects : la liste des projets de l'utilisateur
 * @returns la liste des projets complétés par mois
 */
export const getCompletedProjectsPerMonth = (projects: Project[]): number[] => {
  const months = new Array(12).fill(0);

  projects.forEach((project) => {
    if (!project.completedAt) return;
    const date = new Date(project.completedAt);
    if (date.getFullYear() !== new Date().getFullYear()) return;
    const monthIndex = date.getMonth();
    months[monthIndex]++;
  });

  return months;
};

/**
 * Additionne les éléments de deux listes de même taille
 * @param {number[]} list1 la première liste de nombres
 * @param {number[]} list2 la deuxième liste de nombres
 * @returns la liste résultante de l'addition des éléments de list1 et list2
 */
export const sumLists = (list1: number[], list2: number[]): number[] => {
  if (list1.length !== list2.length) {
    return new Array(12).fill(0);
  }

  return list1.map((value, index) => value + list2[index]);
};
