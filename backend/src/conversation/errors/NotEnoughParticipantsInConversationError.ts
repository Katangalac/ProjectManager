import { AppError } from "../../errors/AppError";

/**
 * Erreur levée lors de la création d'une conversation
 * Est levée lorsqu'il n'y a pas assez des participants dans la conversation
 */
export class NotEnoughParticipantsInConversationError extends AppError{
    constructor() {
        super(`Pas assez des participants pour créer la conversation`, 400, "NOT_ENOUGH_PARTICIPANTS_IN_CONVERSATION");
    }
};