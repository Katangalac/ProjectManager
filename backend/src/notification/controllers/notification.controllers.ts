import * as notificationService from "../services/notification.services";
import * as notificationSchema from "../schemas/notification.schemas";
import { NotificationNotFoundError } from "../errors";
import { Request, Response } from "express";
import { idParamSchema } from "../../schemas/idparam.schema";
import { z } from "zod";

/**
 * Crée une nouvelle notification
 * @param {Request} req : requête Express contenant les infos de la notification à créer
 * @param {Response} res : réponse Express en JSON
 */
export const createNotificationController = async (req: Request, res: Response) => {
    try {
        const notificationData = notificationSchema.createNotificationSchema.parse(req.body);
        const newNotification = await notificationService.createNotification(notificationData);
        res.status(201).json({ message: "Notification créée", newNotification: newNotification });
    } catch (err) {
        console.error("Erreur lors de la création de la notification", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ erreur: "Données invalides" });
        }
        res.status(500).json({ erreur: "Erreur lors de la création de la notification" });
    }
};

/**
 * Récupère les notifications respectant le filtre passé en paramètre
 * @param {Request} req : requête Express
 * @param {Response} res : réponse Express en JSON
 */
export const getNotificationsController = async (req: Request, res: Response) => {
    try {
        const filter = notificationSchema.searchNotificationsFilterSchema.parse(req.query);
        const notifications = await notificationService.getNotifications(filter);
        res.status(200).json(notifications);
    } catch (err) {
        console.error("Erreur lors de la récupération des notifications", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ erreur: "Données invalides" });
        }
        res.status(500).json({ erreur: "Erreur lors de la récupération des notifications" });
    }
};

/**
 * Récupère la notification ayant l'identifiant passé en paramètre
 * @param {Request} req : requête Express contenant l'identifiant de la notification
 * @param {Response} res : réponse Express en JSON
 */
export const getNotificationByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const notification = await notificationService.getNotificationById(id);
        res.status(200).json(notification);
    } catch (err) {
        console.error("Erreur lors de la récupération de la notification", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ erreur: "Données invalides" });
        }
        if (err instanceof NotificationNotFoundError) {
            res.status(404).json({ erreur: "Aucune notification correspond à l'identifiant donné" });
        }
        res.status(500).json({ erreur: "Erreur lors de la récupération de la notification" });
    }
};

/**
 * Marque une notification comme lue
 * @param {Request} req : requête Express contenant l'identifiant de la notification
 * @param {Response} res : réponse Express en JSON
 */
export const markNotificationAsReadController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const updatedNotification = await notificationService.markNotificationAsRead(id);
        res.status(200).json({ message: "Notification mise à jour", notification: updatedNotification });
    } catch (err) {
        console.error("Erreur lors de la mise à jour de la notification", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ erreur: "Données invalides" });
        }
        if (err instanceof NotificationNotFoundError) {
            res.status(404).json({ erreur: "Aucune notification correspond à l'identifiant donné" });
        }
        res.status(500).json({ erreur: "Erreur lors de la mise à jour de la notification" });
    }
};

/**
 * Supprime la notification ayant l'identifiant passé en paramètre
 * @param {Request} req : requête Express contenant l'identifiant de la notification
 * @param {Response} res : réponse Express en JSON
 */
export const deleteNotificationController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        await notificationService.deleteNotification(id);
        res.status(204).send();
    } catch (err) {
        console.error("Erreur lors de la suppression de la notification", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ erreur: "Données invalides" });
        }
        if (err instanceof NotificationNotFoundError) {
            res.status(404).json({ erreur: "Aucune notification correspond à l'identifiant donné" });
        }
        res.status(500).json({ erreur: "Erreur lors de la suppression de la notification" });
    }
};