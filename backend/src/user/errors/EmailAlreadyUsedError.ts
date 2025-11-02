import {AppError} from "../../errors/AppError";

/**
 * Erreur levée lors d'un conflit d'email entre utilisateurs
 */
export class EmailAlreadyUsedError extends AppError{
    constructor() {
        super("Cet email est déjà utilisé", 409, "EMAIL_CONFLICT");
    }
};