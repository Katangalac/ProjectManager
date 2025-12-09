import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteTask } from "../../../services/task.services";

/**
 * Mutation de suppression d'une nouvelle tâche
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (taskId: string) => {
      return await deleteTask(taskId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserTasks"] });
    },

    onError: (error) => {
      console.error("Erreur suppression tâche :", error);
      alert("Erreur lors de la suppression de la tache");
    },
  });

  return {
    deleteTask: mutation.mutate,
    deleteTaskAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
};
