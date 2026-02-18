import { AppError } from "@/errors/AppError";

/**
 * Erreur levée lors d'une recherche d'une invitation
 * Est levée lorsqu'aucune invitation ne répond au critère de recherche (identifiant)
 */
export class InvitationNotFoundError extends AppError {
  constructor(id: string) {
    super(`Invitation ${id} introuvable`, 404, "INVITATION_NOT_FOUND");
  }
}
