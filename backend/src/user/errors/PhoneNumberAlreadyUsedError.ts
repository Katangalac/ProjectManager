import {AppError} from "../../errors/AppError.js";

/**
 * Erreur levée lors d'un conflit de numéro de téléphone entre utilisateurs
 */
export class PhoneNumberAlreadyUsedError extends AppError{
    constructor() {
        super("Ce numéro de téléphone est déjà utilisé", 409, "PHONE_NUMBER_CONFLICT");
    }
}