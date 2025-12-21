import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Task } from "@/types/Task";
import { Project } from "@/types/Project";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTaskStats = (tasks: Task[]) => {
  return {
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    todo: tasks.filter((t) => t.status === "TODO").length,
    blocked: tasks.filter((t) => t.status === "BLOCKED").length,
  };
};

export const getProjectStats = (project: Project[]) => {
  return {
    completed: project.filter((p) => p.status === "COMPLETED").length,
    active: project.filter((p) => p.status === "ACTIVE").length,
    paused: project.filter((p) => p.status === "PAUSED").length,
    planning: project.filter((p) => p.status === "PLANNING").length,
    blocked: project.filter((p) => p.status === "BLOCKED").length,
  };
};
