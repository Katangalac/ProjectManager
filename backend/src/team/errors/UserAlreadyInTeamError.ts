import { AppError } from "../../errors/AppError";

/**
 * Erreur levée lors de l'ajout d'un utlisateur dans une équipe
 * Est levée lorsque l'utilisateur est déjà membre de l'équipe
 */
export class UserAlreadyInTeamError extends AppError{
    constructor(userId:string, teamId:string) {
        super(`L'utilisateur(${userId}) est déjà membre de l'équipe(${teamId})`, 409, "USER_ALREADY_IN_TEAM");
    }
};