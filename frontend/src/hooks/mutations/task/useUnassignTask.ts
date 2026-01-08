import { useQueryClient, useMutation } from "@tanstack/react-query";
import { unassignTask } from "../../../api/task.api";

/**
 * Propriété du hook de la mutation de desassignation d'une tâche
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 * - onError: fonction à appeller en cas d'erreur
 */
type UnassignTaskMutationParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

/**
 * Mutation de desassignation d'une tâche
 * @param {string} taskId - identifiant de la tâche
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useUnassignTaskTask = (
  params: UnassignTaskMutationParams = {}
) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      taskId,
      userId,
    }: {
      taskId: string;
      userId: string;
    }) => {
      await unassignTask(taskId, userId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserTasks"] });
      params.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      params.onError?.();
    },
  });
  return {
    unassignTask: mutation.mutate,
    unassignTaskAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
};
