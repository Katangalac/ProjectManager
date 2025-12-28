import { useQueryClient, useMutation } from "@tanstack/react-query";
import { assignTask } from "../../../services/task.services";

/**
 * Propriété du hook de la mutation d'assignation d'une tâche
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 */
type AssignTaskMutationParams = {
  onSuccess?: () => void;
};

/**
 * Mutation d'assignation d'une tâche
 * @param {string} taskId - identifiant de la tâche
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useAssignTaskTask = (params: AssignTaskMutationParams = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      taskId,
      userId,
    }: {
      taskId: string;
      userId: string;
    }) => {
      await assignTask(taskId, userId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserTasks"] });
      params.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      alert("Erreur lors de l'assignation de la tâche");
    },
  });
  return {
    assignTask: mutation.mutate,
    assignTaskAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
};
