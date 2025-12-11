import { Task, TaskWithRelations } from "../types/Task";
import { Project } from "../types/Project";
import { TASK_STATUS_META } from "../lib/constants/task";
import { PROJECT_STATUS_META } from "../lib/constants/project";

/**
 * Type reprédentant un évenement (Task,Project,...) du calendrier
 */
export type Event = {
  start: string;
  end: string;
  title: string;
  resource: string | number;
  color?: string;
  cssClass?: string;
  dataType?: string;
  originalData?: Task | Project;
};

/**
 * Type représentant une ressource (Task,Project,...) du calendrier
 */
export type Resource = {
  id: string | number;
  name: string;
  color: string;
  children?: Resource[];
  cssClass?: string;
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
    color: TASK_STATUS_META[task.status].hexColor,
    cssClass: "text-center",
    dataType: "Task",
    originalData: task,
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
    color: PROJECT_STATUS_META[project.status].hexColor,
    cssClass: "text-center",
    dataType: "Project",
    originalData: project,
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
    children: [],
    cssClass: "text-left resource-project",
  };
  const resources: Resource[] = [];

  //Mapper les projets en Resource
  for (const p of projects) {
    const res: Resource = {
      id: p.id,
      name: "Project : " + p.title,
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
      color: TASK_STATUS_META[t.status].hexColor,
      cssClass: "text-left resource-task",
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
