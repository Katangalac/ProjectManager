import { AppError } from "../../errors/AppError";

/**
 * Erreur levée lors d'une recherche d'un utilisateur
 * Est levée lorsqu'aucun utilisateur ne répond au critère de recherche (identifiant)
 */
export class UserNotFoundError extends AppError {
  constructor(id: string) {
    super(`User not found`, 404, "USER_NOT_FOUND");
  }
}
