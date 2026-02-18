import { AppError } from "@/errors/AppError";

/**
 * Erreur levée lors d'un conflit de nom d'utilisateur entre utilisateurs
 */
export class UsernameAlreadyUsedError extends AppError {
  constructor() {
    super("This username is already used", 409, "USERNAME_CONFLICT");
  }
}
