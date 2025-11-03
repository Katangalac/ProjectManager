import { AppError } from "../../errors/AppError";

/**
 * Erreur levée lors de l'assignation d'une tache à un utilisateur
 * Est levée lorsque la tache est déjà assignée à l'utilisateur
 */
export class TaskAlreadyAssignedToUserError extends AppError{
    constructor(taskId:string, userId:string) {
        super(`La tâche(${taskId}) est déjà assignée à l'utilisateur(${userId})`, 409, "TASK_ALREADY_ASSIGNED_TO_USER");
    }
};