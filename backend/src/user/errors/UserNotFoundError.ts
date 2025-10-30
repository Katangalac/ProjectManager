import {AppError} from "../../errors/AppError.js";

/**
 * Erreur levée lors d'une recherche d'un utilisateur
 * Est levée lorsqu'aucun utilisateur ne répond au critère de recherche (identifiant)
 */
export class UserNotFoundError extends AppError {
    constructor(id:string) {
        super(`Utilisateur ${id} introuvable`, 404, "USER_NOT_FOUND");
    }
}