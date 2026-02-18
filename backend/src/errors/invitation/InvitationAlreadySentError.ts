import { AppError } from "@/errors/AppError";

/**
 * Erreur levée lorsqu'une invitation en cours existe déjà
 */
export class InvitationAlreadySentError extends AppError {
  constructor() {
    super(
      `Une invitation similaire est déjà envoyée et en attente d'une reponse`,
      409,
      "INVITATION_CONFLICT",
    );
  }
}
