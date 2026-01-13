import {AppError} from "../../errors/AppError";

/**
 * Erreur levée lors d'une recherche d'une conversation
 * Est levée lorsqu'aucune conversation ne répond au critère de recherche (identifiant)
 */
export class ConversationNotFoundError extends AppError {
    constructor(id:string) {
        super(`Conversaton ${id} introuvable`, 404, "CONVERSATION_NOT_FOUND");
    }
};