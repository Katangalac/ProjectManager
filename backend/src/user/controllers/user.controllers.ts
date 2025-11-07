import { Request, Response } from "express";
import { updateUserDataSchema, searchUsersFilterSchema } from "../schemas/user.schemas";
import { EmailAlreadyUsedError, PhoneNumberAlreadyUsedError, UserNotFoundError, UsernameAlreadyUsedError } from "../errors/index";
import * as userService from "../services/user.services";
import { getUserNotifications } from "../../notification/services/notification.services";
import { getUserConversations } from "../../conversation/services/conversation.services";
import { getUserMessages } from "../../message/services/message.services";
import { z } from "zod";
import { idParamSchema } from "../../schemas/idparam.schema";

/**
 * Récupère la liste des utilisateurs repondant à un filtre de recherche (Aucun filtre -> tous)
 * @async
 * @param {Request} req - requête Express contenant les données de filtre à utiliser dans req.query
 * @param {Response} res - réponse Express utilisé pour renvoyer la réponse JSON
 * @returns {Promise<SafeUser>} - retourne un objet JSON contenant la liste des utilisateurs
 */
export const getUsersController = async(req: Request, res: Response) => {
    try {
        const filter = searchUsersFilterSchema.parse(req.query);
        const users = await userService.getUsers(filter);
        res.status(200).json(users);
    } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs", err);
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
};

/**
 * Récupère un utilisateur par son identifiant (id)
 * @async
 * @param {Request} req - requête Express contenant l'identifiant de l'utilisateur dans req.params.id
 * @param {Response} res - réponse Express utilisé pour renvoyer la réponse JSON
 * @returns {Promise<SafeUser>} - retourne un objet JSON contenant les informations de l'utilisateur
 */
export const getUserByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({id:req.params.id});
        const user = await userService.getUserById(id);
        res.status(200).json(user);
    } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur", err);
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: err.message });
        }

        if (err instanceof UserNotFoundError) {
            return res.status(404).json({ message: err.message });
        }

        res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
    }
};

/**
 * Met à jour les informations de l'utilisateur ayant l'identifiant passé en paramètre 
 * @async
 * @param {Request} req - requête Express contenant l'identifiant de l'utilisateur dans req.params.id
 *                      - contient les données à mettre à jour dans req.body
 * @param {Response} res - réponse Express utilisé pour renvoyer la réponse JSON
 * @returns {Promise<SafeUser>} - l'utilisateur avec les informations mises à jour
 */
export const updateUserController = async(req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({id:req.params.id});
        const input = updateUserDataSchema.parse(req.body);
        const user = await userService.updateUser(id, input);
        res.status(200).json({message:"Utilisateur mis à jour avec succès", user});
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'utilisateur", err);
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: err.message });
        }

        if (err instanceof UserNotFoundError) {
            return res.status(404).json({ message: err.message });
        }

        if (err instanceof EmailAlreadyUsedError) {
            return res.status(409).json({ message: err.message });
        }

        if (err instanceof UsernameAlreadyUsedError) {
            return res.status(409).json({ message: err.message });
        }

        if (err instanceof PhoneNumberAlreadyUsedError) {
            return res.status(409).json({ message: err.message });
        }

        res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
    }
};

/**
 * Supprime l'utilisateur ayant l'identifiant passé en paramètre
 * @async
 * @param {Request} req - requête Express contenant l'identifiant de l'utilisateur dans req.params.id
 * @param {Response} res - réponse Express utilisé pour renvoyer la réponse JSON
 */
export const deleteUserController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({id:req.params.id});
        await userService.deleteUser(id);
        res.status(204).send();
    }
    catch (err) {
        console.error("Erreur de la suppression de l'utilisateur", err);
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: err.message });
        }

        if (err instanceof UserNotFoundError) {
            return res.status(404).json({ message: err.message });
        }

        res.status(500).json({ message: "Erreur de la suppression de l'utilisateur" });
    }
};

/**
 * Récupère toutes les équipes dont l'utilisateur est membre
 * @param {Request} req - requete Express contenant l'identifiant de l'utilisateur
 * @param {Response} res - reponse Express em JSON
 */
export const getUserTeamsController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const teams = await userService.getUserTeams(id);
        res.status(200).json(teams);
    } catch (err) {
        console.error("Erreur lors de la récupération des équipes de l'utilisateur : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        res.status(500).json({ error: "Erreur lors de la récupération des équipes de l'utilisateur" });
    }
};

/**
 * Récupère tous les projets dans lesquels l'utilisateur intervient
 * @param {Request} req - requete Express contenant l'identifiant de l'utilisateur
 * @param {Response} res - reponse Express em JSON
 */
export const getUserProjectsController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const projects = await userService.getUserProjects(id);
        res.status(200).json(projects);
    } catch (err) {
        console.error("Erreur lors de la récupération des projets de l'utilisateur : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        res.status(500).json({ error: "Erreur lors de la récupération des projets de l'utilisateur" });
    }
};

/**
 * Récupère toutes les tâches assignées à un utilisateur
 * @param {Request} req - requete Express contenant l'identifiant de l'utilisateur
 * @param {Response} res - reponse Express em JSON
 */
export const getUserTasksController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const userTasks = await userService.getUserTasks(id);
        res.status(200).json(userTasks);
    } catch (err) {
        console.error("Erreur lors de la récupération des taches de l'utilisateur : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        res.status(500).json({ error: "Erreur lors de la récupération des taches de l'utilisateur" });
    }
};

/**
 * Récupère toutes les notifications d'un utilisateur
 * @param {Request} req - requete Express contenant l'identifiant de l'utilisateur
 * @param {Response} res - reponse Express em JSON
 */
export const getUserNotificationsController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const userNotifications = await getUserNotifications(id);
        res.status(200).json(userNotifications);
    } catch (err) {
        console.error("Erreur lors de la récupération des notifications de l'utilisateur : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        res.status(500).json({ error: "Erreur lors de la récupération des notifications de l'utilisateur" });
    }
};

/**
 * Récupère toutes les conversations d'un utilisateur
 * @param {Request} req - requete Express contenant l'identifiant de l'utilisateur
 * @param {Response} res - reponse Express em JSON
 */
export const getUserConversationsController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const userConversations = await getUserConversations(id);
        res.status(200).json(userConversations);
    } catch (err) {
        console.error("Erreur lors de la récupération des conversations de l'utilisateur : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        res.status(500).json({ error: "Erreur lors de la récupération des conversations de l'utilisateur" });
    }
};

/**
 * Récupère tous les messages d'un utilisateur
 * @param {Request} req - requete Express contenant l'identifiant de l'utilisateur
 * @param {Response} res - reponse Express em JSON
 */
export const getUserMessagesController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const userMessages = await getUserMessages(id);
        res.status(200).json(userMessages);
    } catch (err) {
        console.error("Erreur lors de la récupération des messages de l'utilisateur : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        res.status(500).json({ error: "Erreur lors de la récupération des messages de l'utilisateur" });
    }
};


