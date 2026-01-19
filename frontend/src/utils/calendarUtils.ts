/* eslint-disable @typescript-eslint/no-explicit-any */
import { TaskWithRelations } from "../types/Task";
import { Project } from "../types/Project";
import { TASK_STATUS_META } from "../lib/constants/task";
import { PROJECT_STATUS_META } from "../lib/constants/project";
import { User } from "@/types/User";
import { dateToLongString } from "./dateUtils";

/**
 * Type reprédentant un évenement (Task,Project,...) du calendrier
 */
export type Event = {
  start?: string | undefined;
  end?: string | undefined;
  title?: string | undefined;
  description?: string;
  resource?: string | number | (string | number)[] | undefined;
  color?: string;
  cssClass?: string;
  dataType?: string;
  progress?: number;
  status?:
    | "COMPLETED"
    | "ACTIVE"
    | "BLOCKED"
    | "TODO"
    | "PAUSED"
    | "IN_PROGRESS"
    | "PLANNING";
  completedAt?: string | undefined;
  assignedTo?: { user: User }[];
  original?: TaskWithRelations | Project | any;
};

/**
 * Type représentant une ressource (Task,Project,...) du calendrier
 */
export type Resource = {
  id: string | number;
  name: string;
  color: string;
  description?: string;
  children?: Resource[];
  cssClass?: string;
  assignedTo?: { user: User }[];
  original?: any;
};

/**
 * Transforme une tâche en évènemnt de calendrier
 * @param {TaskWithRelations} task - la tâche qu'on veut transformer en évenement
 * @returns {Event} - l'évènement représentant la tâche dans le caledrier
 */
export function taskToEvent(task: TaskWithRelations): Event {
  return {
    title: task.title,
    start: new Date(task.startedAt).toISOString().split("T")[0],
    end: new Date(task.deadline).toISOString().split("T")[0],
    resource: task.id,
    description: task.description,
    progress: task.progress,
    color: TASK_STATUS_META[task.status].hexColor,
    cssClass: "text-left",
    dataType: "Task",
    status: task.status,
    completedAt:
      task.completedAt !== null
        ? dateToLongString(new Date(task.completedAt))
        : undefined,
    assignedTo: task.assignedTo,
    original: task,
  };
}

/**
 * Transforme un projet en évènemnt de calendrier
 * @param {Project} project - le projet qu'on veut transformer en évenement
 * @returns {Event} - l'évènement représentant le projet dans le caledrier
 */
export function projectToEvent(project: Project): Event {
  return {
    title: project.title,
    start: new Date(project.startedAt).toISOString().split("T")[0],
    end: new Date(project.deadline).toISOString().split("T")[0],
    resource: project.id,
    description: project.description,
    progress: project.progress,
    color: PROJECT_STATUS_META[project.status].hexColor,
    cssClass: "text-left",
    dataType: "Project",
    status: project.status,
    completedAt:
      project.completedAt !== null
        ? dateToLongString(new Date(project.completedAt))
        : undefined,
    original: project,
  };
}

/**
 * Transforme une liste des tâches et de projets en liste des ressources du calendrier
 * Établie des relations Parent-Enfant entre les ressources dont la tâche (enfant)
 * fait partie d'un projet (Parent)
 *
 * @param {TaskWithRelations} tasks - la liste des tâches
 * @param {Project} projects - la liste des projets
 * @returns {Resource[]} - la liste des ressources du calendrier
 */
export function mapProjectsAndTasksToResources(
  tasks: TaskWithRelations[],
  projects: Project[]
): Resource[] {
  const projectMap: Record<string, Resource> = {};

  //Resource dans laquelle seront rassemblées les tâches sans projet
  const isolatedTask: Resource = {
    id: 0,
    color: "#D1D5DB",
    name: "Isolated Tasks",
    description: "Tasks without project",
    children: [],
    cssClass: "text-left resource-project",
  };
  const resources: Resource[] = [];

  //Mapper les projets en Resource
  for (const p of projects) {
    const res: Resource = {
      id: p.id,
      name: p.title,
      description: p.description,
      color: PROJECT_STATUS_META[p.status].hexColor,
      children: [],
      cssClass: "text-left resource-project",
    };
    projectMap[p.id] = res;
    resources.push(res);
  }

  //Mapper les tâches en Resource
  for (const t of tasks) {
    const taskRes: Resource = {
      id: t.id,
      name: t.title,
      description: t.description,
      color: TASK_STATUS_META[t.status].hexColor,
      cssClass: "text-left",
      original: t,
      assignedTo: t.assignedTo,
    };

    if (t.projectId && projectMap[t.projectId]) {
      projectMap[t.projectId].children!.push(taskRes);
    } else {
      isolatedTask.children!.push(taskRes);
    }
  }
  resources.push(isolatedTask);
  return resources;
}
