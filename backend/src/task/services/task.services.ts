import {CreateTaskData, SearchTasksFilter, Task, UpdateTaskData} from "../types/Task";
import { TaskNotFoundError, TaskNotAssignedToUserError, TaskAlreadyAssignedToUserError } from "../errors";
import { db } from "../../db";
import { Prisma, UserTask } from "@prisma/client";
import { Team } from "../../team/types/Team";
import { Project } from "@prisma/client";
import { SafeUser } from "../../user/types/User";
import { toSafeUser } from "../../user/services/user.transforms";

/**
 * Crée une nouvelle tâche
 * @async
 * @param {CreateTaskData} taskData - informations sur la tache
 * @returns {Task} - un objet représentant la tache créée
 */
export const createTask = async (taskData: CreateTaskData): Promise<Task> => {
    const task = await db.task.create({
        data: taskData
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
export const getTaskById = async (id: string):Promise<Task> => {
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
    const { page, pageSize, ..._} = filter;
    const where: Prisma.TaskWhereInput = {};
    if (filter.title) where.title = { contains: filter.title, mode: 'insensitive' };
    if (filter.status) where.status = filter.status;
    if (filter.startOn) where.startedAt = { equals: new Date(filter.startOn) }
    if (filter.startBefore) where.startedAt = { lt: new Date(filter.startBefore) }
    if (filter.startAfter) where.startedAt = { gt: new Date(filter.startAfter) }
    if (filter.endOn) where.deadline = { equals: new Date(filter.endOn) }
    if (filter.endBefore) where.deadline = { lt: new Date(filter.endBefore) }
    if (filter.endAfter) where.deadline = { gt: new Date(filter.endAfter) }
    if (filter.completedOn) where.completedAt = { equals: new Date(filter.completedOn) }
    if (filter.completedBefore) where.completedAt = { lt: new Date(filter.completedBefore) }
    if (filter.completedAfter) where.completedAt = { gt: new Date(filter.completedAfter) }
    if (filter.priorityLevelEq) where.priorityLevel = { equals: filter.priorityLevelEq }
    if (filter.priorityLevelLt) where.priorityLevel = { lt: filter.priorityLevelLt }
    if(filter.priorityLevelGt) where.priorityLevel = {gt: filter.priorityLevelGt}
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const tasks = await db.task.findMany({
        where,
        skip,
        take
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
export const updateTask = async (id: string, taskData: UpdateTaskData): Promise<Task> => {
    const task = await db.task.findUnique({ where: { id } });
    if (!task) throw new TaskNotFoundError(id);
    const updatedTask = await db.task.update({
        where: { id },
        data: taskData as Prisma.TaskUpdateInput
    });
    return updatedTask;
};

/**
 * Supprime la tache ayant l'identifiant passé en paramètre
 * @async
 * @param {string} id - l'identifiant de la tache à supprimer
 * @throws {TaskNotFoundError} - lorsqu'aucune tache avec l'identifiant donné n'a été trouvée
 */
export const deleteTask = async (id: string) => {
    const task = await db.task.findUnique({ where: { id } });
    if (!task) throw new TaskNotFoundError(id);
    await db.task.delete({ where: { id } });
};

/**
 * Assigne une tâche à un utilisateur
 * @async
 * @param {string} taskId - identifiant de la tache à assigner à l'utilisateur
 * @param {string} userId - identifiant de l'utilisateur
 * @returns {UserTask} - un objet représentant le lien créé entre la tache et l'utilisateur
 * @throws {TaskAlreadyAssignedToUserError} - lorsque la tache a déjà été assignée à l'utilisateur
 */
export const assignTaskToUser = async (taskId: string, userId: string):Promise<UserTask> => {
    let userTaskPair = await db.userTask.findUnique({
        where: {
            pk_user_task: { taskId, userId }
        }
    });
    if (userTaskPair) throw new TaskAlreadyAssignedToUserError(taskId, userId);

    userTaskPair = await db.userTask.create({
        data: {
            taskId,
            userId
        }
    });
    return userTaskPair;
};

/**
 * Desassigne un utilisateur d'une tache
 * @async
 * @param {string} userId - identifiant de l'utilisateur 
 * @param {string} taskId - identifiant de la tache
 * @throws {TaskNotAssignedToUserError} - lorsque la tache n'était pas assignée à l'utilisateur
 */
export const unassignUserFromTask = async (userId: string, taskId: string) => {
    const userTaskPair = await db.userTask.findUnique({
        where: {
            pk_user_task: {taskId, userId}
        }
    });
    if (!userTaskPair) throw new TaskNotAssignedToUserError(taskId, userId);

    await db.userTask.delete({
        where: {
            pk_user_task: { taskId, userId }
        }
    });
};

/**
 * Récupère tous les utilisateurs qui ont contribué à une tache
 * @param taskId - identifiant de la tache
 * @returns {SafeUser[]} - les utilisateurs intervenant dans la tache
 */
export const getTaskContributors = async (taskId: string): Promise<SafeUser[]> => {
    const taskContributors = await db.user.findMany({
        where: {
            OR: [
                {
                    userTeams: {
                        some: {
                            team: {
                                teamTasks: {
                                    some:{id:taskId}
                                }
                            }
                        }
                    },
                },
                {
                    assignedTasks: {
                        some: {taskId}
                    },
                }
            ]
        }
    });
    const taskSafeContributors = taskContributors.map(toSafeUser);
    return taskSafeContributors;
};
