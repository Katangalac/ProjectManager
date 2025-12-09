import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateTask } from "../../../services/task.services";
import { UpdateTaskData } from "../../../types/Task";

/**
 * Mutation de modification d'une nouvelle tâche
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useUpdateTask = () => {
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
