import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createTask } from "../../../services/task.services";
import { CreateTaskData } from "../../../types/Task";

/**
 * Mutation de création d'une nouvelle tâche
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: CreateTaskData) => {
      await createTask(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserTasks"] });
    },
    onError: (error) => {
      console.error(error);
      alert("Erreur lors de la création de la tâche");
    },
  });
  return {
    createTask: mutation.mutate,
    createTaskAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
