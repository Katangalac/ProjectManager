import { AppError } from "../../errors/AppError";

/**
 * Erreur levée lors d'une recherche d'une équipe
 * Est levée lorsqu'aucune équipe ne répond au critère de recherche (identifiant)
 */
export class TeamNotFoundError extends AppError{
    constructor(id:string) {
        super(`Équipe ${id} introuvable`, 404, "TEAM_NOT_FOUND");
    }
};