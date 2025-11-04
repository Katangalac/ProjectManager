import { AppError } from "../../errors/AppError";

/**
 * Erreur levée lors du retrait d'une tache à un utilisateur
 * Est levée lorsque la tache n'était pas assignée à l'utilisateur
 */
export class TaskNotAssignedToUserError extends AppError{
    constructor(taskId:string, userId:string) {
        super(`La tâche(${taskId}) n'est pas assignée à l'utilisateur(${userId})`, 404, "TASK_NOT_ASSIGNED_TO_USER");
    }
};