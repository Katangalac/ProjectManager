import {AppError} from "../../errors/AppError";

/**
 * Erreur levée lors d'une recherche d'une notification
 * Est levée lorsqu'aucune notification ne répond au critère de recherche (identifiant)
 */
export class NotificationNotFoundError extends AppError {
    constructor(id:string) {
        super(`Notification ${id} introuvable`, 404, "NOTIFICATION_NOT_FOUND");
    }
};