import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteTask } from "../../../api/task.api";

/**
 * Propriété du hook de la mutation de suppression d'une tâche
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 */
type DeleteTaskMutationParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

/**
 * Mutation de suppression d'une nouvelle tâche
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useDeleteTask = (params: DeleteTaskMutationParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (taskId: string) => {
      return await deleteTask(taskId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserTasks"] });
      params.onSuccess?.();
    },

    onError: (error) => {
      console.error("Erreur suppression tâche :", error);
      params.onError?.();
    },
  });

  return {
    deleteTask: mutation.mutate,
    deleteTaskAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
};
