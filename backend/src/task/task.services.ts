import {
  CreateTaskData,
  SearchTasksFilter,
  Task,
  UpdateTaskData,
} from "./Task";
import {
  TaskNotFoundError,
  TaskNotAssignedToUserError,
  TaskAlreadyAssignedToUserError,
} from "./errors";
import { db } from "../db";
import { Prisma, UserTask } from "@prisma/client";
import { Team } from "../team/Team";
import { Project } from "@prisma/client";
import { SafeUser, SearchUsersFilter } from "../user/User";
import { toSafeUser } from "../user/user.transforms";
import { buildTaskWhereInput } from "../utils/utils";
import { buildUserWhereInput } from "../utils/utils";
import { addNotificationToQueue } from "../notification/notification.queue";

/**
 * Crée une nouvelle tâche
 * @async
 * @param {CreateTaskData} taskData - informations sur la tache
 * @returns {Task} - un objet représentant la tache créée
 */
export const createTask = async (taskData: CreateTaskData): Promise<Task> => {
  const task = await db.task.create({
    data: taskData,
  });
  return task;
};

/**
 * Récupère la tache ayant l'identifiant passé en paramètre
 * @async
 * @param {string} id - l'identifiant de la tache à récupérer
 * @returns {Task} - la tache ayant l'identifiant passé en paramètre
 * @throws {TaskNotFoundError} - lorsqu'aucune tache avec l'identifiant donné n'a été trouvée
 */
export const getTaskById = async (id: string): Promise<Task> => {
  const task = await db.task.findUnique({ where: { id } });
  if (!task) throw new TaskNotFoundError(id);
  return task;
};

/**
 * Récupère les taches remplissant les critères de filtre passé en paramètre
 * @async
 * @param {SearchTasksFilter} filter - les filtres de recherche à utiliser
 * @returns {Task[]} - la liste de taches remplissant les critères de recherche
 */
export const getTasks = async (filter: SearchTasksFilter): Promise<Task[]> => {
  const { page, pageSize, ..._ } = filter;
  const where = buildTaskWhereInput(filter);
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  const tasks = await db.task.findMany({
    where,
    skip,
    take,
  });
  return tasks;
};

/**
 * Met à jour les informations d'une tache
 * @async
 * @returns {Task} - la tache ayant l'identifiant passé en paramètre
 * @param {UpdateTaskData} taskData - les nouvelles informations de la tache
 * @throws {TaskNotFoundError} - lorsqu'aucune tache avec l'identifiant donné n'a été trouvée
 */
export const updateTask = async (
  id: string,
  taskData: UpdateTaskData
): Promise<Task> => {
  try {
    const updatedTask = await db.task.update({
      where: { id },
      data: taskData as Prisma.TaskUpdateInput,
    });
    return updatedTask;
  } catch (err: any) {
    if (err.code === "P2025") throw new TaskNotFoundError(id);
    throw err;
  }
};

/**
 * Supprime la tache ayant l'identifiant passé en paramètre
 * @async
 * @param {string} id - l'identifiant de la tache à supprimer
 * @throws {TaskNotFoundError} - lorsqu'aucune tache avec l'identifiant donné n'a été trouvée
 */
export const deleteTask = async (id: string) => {
  try {
    await db.task.delete({ where: { id } });
  } catch (err: any) {
    if (err.code === "P2025") throw new TaskNotFoundError(id);
    throw err;
  }
};

/**
 * Assigne une tâche à un utilisateur
 * @async
 * @param {string} taskId - identifiant de la tache à assigner à l'utilisateur
 * @param {string} userId - identifiant de l'utilisateur
 * @returns {UserTask} - un objet représentant le lien créé entre la tache et l'utilisateur
 * @throws {TaskAlreadyAssignedToUserError} - lorsque la tache a déjà été assignée à l'utilisateur
 */
export const assignTaskToUser = async (
  taskId: string,
  userId: string
): Promise<UserTask> => {
  try {
    const userTaskPair = await db.userTask.create({
      data: {
        taskId,
        userId,
      },
    });

    try {
      await addNotificationToQueue(
        userId,
        `NEW_TASK-${taskId}`,
        "You have been assigned to a new task"
      );
    } catch (err: any) {
      console.log("Erreur lors de l'ajoue de la notification", err);
    }

    return userTaskPair;
  } catch (err: any) {
    if (err.code === "P2002")
      throw new TaskAlreadyAssignedToUserError(taskId, userId);
    throw err;
  }
};

/**
 * Desassigne un utilisateur d'une tache
 * @async
 * @param {string} userId - identifiant de l'utilisateur
 * @param {string} taskId - identifiant de la tache
 * @throws {TaskNotAssignedToUserError} - lorsque la tache n'était pas assignée à l'utilisateur
 */
export const unassignUserFromTask = async (userId: string, taskId: string) => {
  try {
    await db.userTask.delete({
      where: {
        pk_user_task: { taskId, userId },
      },
    });

    try {
      await addNotificationToQueue(
        userId,
        `UNASSIGN_TASK-${taskId}`,
        "You have been unassigned from a task"
      );
    } catch (err: any) {
      console.log("Erreur lors de l'ajoue de la notification", err);
    }
  } catch (err: any) {
    if (err.code === "P2025")
      throw new TaskNotAssignedToUserError(taskId, userId);
    throw err;
  }
};

/**
 * Récupère tous les utilisateurs qui ont contribué à une tache
 * @async
 * @param {string} taskId - identifiant de la tache
 * @param {SearchUsersFilter} - filtre de recherche à utiliser
 * @returns {SafeUser[]} - les utilisateurs intervenant dans la tache
 */
export const getTaskContributors = async (
  taskId: string,
  filter: SearchUsersFilter
): Promise<SafeUser[]> => {
  const { page, pageSize, all, ..._ } = filter;
  const taskContributorCondition: Prisma.UserWhereInput = {
    OR: [
      {
        userTeams: {
          some: {
            team: {
              teamTasks: {
                some: { id: taskId },
              },
            },
          },
        },
      },
      {
        assignedTasks: {
          some: { taskId },
        },
      },
    ],
  };

  const userFilter = buildUserWhereInput(filter);

  const query: Prisma.UserFindManyArgs = {
    where: {
      AND: [taskContributorCondition, userFilter],
    },
    orderBy: { updatedAt: "desc" },
  };

  if (!all) {
    query.skip = (page - 1) * pageSize;
    query.take = pageSize;
  }
  const taskContributors = await db.user.findMany(query);
  const taskSafeContributors = taskContributors.map(toSafeUser);
  return taskSafeContributors;
};
