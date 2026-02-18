import { AppError } from "@/errors/AppError";

/**
 * Erreur levée lors d'une recherche d'un projet
 * Est levée lorsqu'aucun projet ne répond au critère de recherche (identifiant)
 */
export class ProjectNotFoundError extends AppError {
  constructor(id: string) {
    super(`Projet ${id} introuvable`, 404, "PROJECT_NOT_FOUND");
  }
}
