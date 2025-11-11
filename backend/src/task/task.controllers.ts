import * as taskService from "./task.services";
import * as taskSchemas from "./task.schemas";
import * as taskError from "./errors";
import { Request, Response } from "express";
import { z } from "zod";
import { idParamSchema } from "../schemas/idparam.schema";
import { searchUsersFilterSchema } from "../user/user.schemas";
import { TaskStatus } from "@prisma/client";
import { addNotificationToQueue } from "../notification/notification.queue";

/**
 * Crée une nouvelle tache
 * @async
 * @param {Request} req - requete Express contenant les infos de la tache à créer
 * @param {Response} res - reponse Express en JSON
 */
export const createTaskController = async (req: Request, res: Response) => {
    try {
        const taskData = taskSchemas.createTaskSchema.parse(req.body);
        if (!taskData.creatorId && req.user) {
            taskData.creatorId = req.user?.sub;
        }
        const newTask = await taskService.createTask(taskData);
        res.status(201).json({ message: "Tâche créée", newTask: newTask });
    } catch (err) {
        console.error("Erreur lors de la création de la tâche : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        res.status(500).json({ error: "Erreur lors de la création de la tâche" });
    }
};

/**
 * Récupère les taches enregistrées dans le système respectant le filtre passé en paramètre
 * @async
 * @param {Request} req - requete Express 
 * @param {Response}  res - reponse Express en JSON
 */
export const getTasksController = async (req: Request, res: Response) => {
    try {
        const filter = taskSchemas.searchTasksFilterSchema.parse(req.query);
        const tasks = await taskService.getTasks(filter);
        res.status(200).json(tasks);
    }catch (err) {
        console.error("Erreur lors de la récupération des tâches : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        res.status(500).json({ error: "Erreur lors de la récupération des tâches" });
    }
};

/**
 * Récupère la tache ayant l'identifiant passé en paramètre
 * @async
 * @param {Request} req - requete Express contenant l'identifiant de la tache
 * @param {Response} res - reponse Express en JSON
 */
export const getTaskByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const task = await taskService.getTaskById(id);
        res.status(200).json(task);
    } catch (err) {
        console.error("Erreur lors de la récupération de la tâche : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        if (err instanceof taskError.TaskNotFoundError) {
            res.status(404).json({ error: "Aucune tâche correspond à l'idetifiant donné" });
        }
        res.status(500).json({ error: "Erreur lors de la récupération de la tâche" });
    }
};

/**
 * Met à jour les informations d'une tache
 * @param {Request} req - requete Express contenant l'identifiant de la tache
 * @param {Response} res - réponse Express en JSON
 */
export const updateTaskController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const taskData = taskSchemas.updateTaskDataSchema.parse(req.body);
        const updatedTask = await taskService.updateTask(id, taskData);
        res.status(200).json({ message: "Tâche mise à jour avec succès", updatedTask: updatedTask });
    } catch (err) {
        console.error("Erreur lors de la mise à jour de la tâche : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        if (err instanceof taskError.TaskNotFoundError) {
            res.status(404).json({ error: "Aucune tâche correspond à l'idetifiant donné" });
        }
        res.status(500).json({ error: "Erreur lors de la mise à jour de la tâche" });
    }
};

/**
 * Met à jour le status d'une tache
 * @param {Request} req - requete Express contenant l'identifiant de la tache
 * @param {Response} res - réponse Express en JSON
 */
export const updateTaskStatusController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const newStatus = z.enum(TaskStatus).parse(req.body);
        const updatedTask = await taskService.updateTask(id, {status:newStatus});
        res.status(200).json({ message: "Tâche mise à jour avec succès", updatedTask: updatedTask });
    } catch (err) {
        console.error("Erreur lors de la mise à jour de la tâche : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        if (err instanceof taskError.TaskNotFoundError) {
            res.status(404).json({ error: "Aucune tâche correspond à l'idetifiant donné" });
        }
        res.status(500).json({ error: "Erreur lors de la mise à jour de la tâche" });
    }
};

/**
 * Supprime une tache
 * @async
 * @param {Request} req - requete Express contenant l'identifiant de la tache
 * @param {Response} res - reponse Express en JSON
 */
export const deleteTaskController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        await taskService.deleteTask(id);
        res.status(204).send();
    } catch (err) {
        console.error("Erreur lors de la suppression de la tâche : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        if (err instanceof taskError.TaskNotFoundError) {
            res.status(404).json({ error: "Aucune tâche correspond à l'idetifiant donné" });
        }
        res.status(500).json({ error: "Erreur lors de la suppression de la tâche" });
    }
};

/**
 * Assigne une tache à un utilisateur
 * @async
 * @param {Request} req - requete Express contenant l'identifiant de l'utilisateur et de la tâche
 * @param {Response} res - reponse Express en JSON
 */
export const assignTaskToUserController = async (req: Request, res: Response) => {
    try {
        const { id:taskId } = idParamSchema.parse({ id: req.params.id });
        const {id:userId} = idParamSchema.parse({ id: req.params.userId });
        const userTaskPair = await taskService.assignTaskToUser(taskId, userId);
        res.status(200).json({ message: "La tâche a été assignée à l'utilisateur", userTaskPair: userTaskPair });
        addNotificationToQueue(userId, "Nouvelle tâche assignée", "Une nouvelle tâche vous a été assignée");
    }catch (err) {
        console.error("Erreur lors de l'assignation de la tâche à l'utilisateur : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        if (err instanceof taskError.TaskAlreadyAssignedToUserError) {
            res.status(409).json({ error: "Cette tâche a déjà été assignée à cet utilisateur" });
        }
        res.status(500).json({ error: "Erreur lors de l'assignation de la tâche à l'utilisateur" });
    }
};

/**
 * Désassigne un utilisateur d'une tache
 * @async
 * @param {Request} req - requete Express contenant l'identifiant de l'utilisateur et de la tache
 * @param {Response} res - reponse Express en JSON
 */
export const unassignUserFromTaskController = async (req: Request, res: Response) => {
    try {
        const { id:taskId } = idParamSchema.parse({ id: req.params.id });
        const { id:userId } = idParamSchema.parse({ id: req.params.userId });
        await taskService.unassignUserFromTask(userId, taskId);
        addNotificationToQueue(userId,"Tâche desassignée", "Une tâche vous a été desassignée");
        res.status(204).send();
    }catch (err) {
        console.error("Erreur lors de la désassignation de l'utilisateur de la tâche : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        if (err instanceof taskError.TaskNotAssignedToUserError) {
            res.status(409).json({ error: "Cette tâche n'était pas assignée à l'utilisateur" });
        }
        res.status(500).json({ error: "Erreur lors de la désassignation de l'utilisateur de la tâche" });
    }
};


/**
 * Récupère les utilisateurs qui interviennent dans une tache
 * @async
 * @param {Request} req - requete Express contenant l'id de la tache
 * @param {Response} res - reponse Express en JSON
 */
export const getTaskContributorsController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const filter = searchUsersFilterSchema.parse(req.query);
        const taskContributors = await taskService.getTaskContributors(id, filter);
        res.status(200).json(taskContributors);
    } catch (err) {
        console.error("Erreur lors de la récupération des contributeurs : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        res.status(500).json({ error: "Erreur lors de la récupération des contributeurs" });
    }
};

