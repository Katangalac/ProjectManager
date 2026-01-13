import { AppError } from "../../errors/AppError";

/**
 * Erreur levée lors d'un conflit de numéro de téléphone entre utilisateurs
 */
export class PhoneNumberAlreadyUsedError extends AppError {
  constructor() {
    super("This phone number is already used", 409, "PHONE_NUMBER_CONFLICT");
  }
}
