import { AppError } from "../AppError";

/**
 * Erreur levée lors du retrait d'une équipe à un projet
 * Est levée lorsque l'équipe n'est pas présente dans le projet
 */
export class TeamNotInProjectError extends AppError {
  constructor(teamId: string, projectId: string) {
    super(
      `L'uéquipe(${teamId}) n'est pas dans le projet(${projectId})`,
      404,
      "TEAM_NOT_IN_PROJECT",
    );
  }
}
