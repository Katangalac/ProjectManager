import {AppError} from "../../errors/AppError";

/**
 * Erreur levée lors d'un conflit de nom d'utilisateur entre utilisateurs
 */
export class UsernameAlreadyUsedError extends AppError {
    constructor() {
        super("Ce nom d'utilisateur est déjà utilisé", 409, "USERNAME_CONFLICT");
    }
};