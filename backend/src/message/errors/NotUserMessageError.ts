import {AppError} from "../../errors/AppError";

/**
 * Erreur levée lors d'une modification de message
 * Est levée lorsque message n'est pas celui de l'utilisateur qui essaye de le modifier ou supprimer
 */
export class NotUserMessageError extends AppError {
    constructor(userId:string, messageId:string) {
        super(`L'utilisateur ${userId} ne peut pas modifier ou supprimer le message ${messageId} car il ne lui appartient pas`, 401, "NOT_USER_MESSAGE");
    }
};