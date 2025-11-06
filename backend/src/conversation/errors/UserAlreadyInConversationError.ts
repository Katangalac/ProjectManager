import { AppError } from "../../errors/AppError";

/**
 * Erreur levée lors de l'ajout d'un utlisateur dans une conversation
 * Est levée lorsque l'utilisateur est déjà dans la conversation
 */
export class UserAlreadyInConversationError extends AppError{
    constructor(userId:string, conversationId:string) {
        super(`L'utilisateur(${userId}) est déjà dans la conversation(${conversationId})`, 409, "USER_ALREADY_IN_CONVERSATION");
    }
};