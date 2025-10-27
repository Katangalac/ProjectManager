import { AppError } from "../../errors/AppError";

/**
 * Erreur levée lors de la création d'un utilisateur déjà enregistré dans le système
 * Peut être declenché lors d'une authentification 0Auth
 */
export class UserAlreadyExistError extends AppError{
    constructor() {
        super("Cet utilisateur existe déjà", 409, "USER_CONFLICT");
    }
}