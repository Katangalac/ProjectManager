import { AppError } from "../../errors/AppError";

/**
 * Erreur levée lors de l'ajout d'une notification dans la queue
 */
export class NotificationQueueError extends AppError {
  constructor() {
    super(
      `Erreur lors de l'ajout de la notification dans la queue`,
      500,
      "NOTIFICATION_QUEUE"
    );
  }
}
