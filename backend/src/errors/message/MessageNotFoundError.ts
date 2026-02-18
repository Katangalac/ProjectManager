import { AppError } from "../AppError";

/**
 * Erreur levée lors d'une recherche d'un message
 * Est levée lorsqu'aucun message ne répond au critère de recherche (identifiant)
 */
export class MessageNotFoundError extends AppError {
  constructor(id: string) {
    super(`Message ${id} introuvable`, 404, "MESSAGE_NOT_FOUND");
  }
}
