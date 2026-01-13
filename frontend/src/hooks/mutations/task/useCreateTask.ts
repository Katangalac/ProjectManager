import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createTask } from "../../../api/task.api";
import { CreateTaskData } from "../../../types/Task";

/**
 * Propriété du hook de la mutation de création d'une tâche
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 * - onError: fonction à appeller en cas d'erreur
 */
type CreateTaskMutationParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

/**
 * Mutation de création d'une nouvelle tâche
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useCreateTask = (params: CreateTaskMutationParams = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: CreateTaskData) => {
      await createTask(data);
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
    createTask: mutation.mutate,
    createTaskAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
