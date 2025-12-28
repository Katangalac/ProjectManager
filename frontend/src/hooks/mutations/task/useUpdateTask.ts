import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateTask } from "../../../services/task.services";
import { UpdateTaskData } from "../../../types/Task";

/**
 * Propriété du hook de la mutation de mdofication d'une tâche
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 */
type UpdateTaskMutationParams = {
  onSuccess?: () => void;
};

/**
 * Mutation de modification d'une tâche
 * @param {string} taskId - identifiant de la tâche
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useUpdateTask = (params: UpdateTaskMutationParams = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      taskId,
      data,
    }: {
      taskId: string;
      data: UpdateTaskData;
    }) => {
      await updateTask(taskId, data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserTasks"] });
      params.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      alert("Erreur lors de la mise à jour de la tâche");
    },
  });
  return {
    updateTask: mutation.mutate,
    updateTaskAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
};
