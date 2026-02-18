import { AppError } from "../AppError";

/**
 * Erreur levée lors d'une recherche d'une tâche
 * Est levée lorsqu'aucune tâche ne répond au critère de recherche (identifiant)
 */
export class TaskNotFoundError extends AppError {
  constructor(id: string) {
    super(`Tâche ${id} introuvable`, 404, "TASK_NOT_FOUND");
  }
}
