import { AppError } from "@/errors/AppError";

/**
 * Erreur levée lors d'un conflit d'email entre utilisateurs
 */
export class EmailAlreadyUsedError extends AppError {
  constructor() {
    super("This email is already used", 409, "EMAIL_CONFLICT");
  }
}
