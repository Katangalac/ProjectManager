import { AppError } from "../../errors/AppError";

/**
 * Erreur levée lors de l'ajout d'une équiper dans un projet
 * Est levée lorsque l'équipe est déjà intégrée au projet
 */
export class TeamAlreadyInProjectError extends AppError{
    constructor(teamId:string, projectId:string) {
        super(`L'équipe(${teamId}) est déjà intégrée au projet(${projectId})`, 409, "TEAM_ALREADY_IN_PROJECT");
    }
};