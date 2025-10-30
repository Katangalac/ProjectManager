import { AppError } from "../../errors/AppError"

/**
 * Erreur levée lors du retrait d'un utlisateur d'une équipe
 * Est levée lorsque l'utilisateur n'est pas membre de l'quipe
 */
export class UserNotInTeamError extends AppError{
    constructor(userId:string, teamId:string) {
        super(`L'utilisateur(${userId}) n'est déjà membre de l'équipe(${teamId})`, 404, "USER_NOT_IN_TEAM");
    }
}
