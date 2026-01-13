import { useQuery } from "@tanstack/react-query";
import { getCurrentUserTasks } from "../../../api/task.api";
import { SearchTasksFilter } from "../../../types/Task";
import { TasksApiResponse } from "@/types/Task";

/**
 * Récupère les tâches de l'utilisaeur courant
 * @param {SearchTasksFilter} params - paramètres de la requête
 * @returns la liste des tâches repondant aux critères de recherche
 */
export const useTasks = (params: SearchTasksFilter) => {
  const { data, isLoading, isError, refetch } = useQuery<TasksApiResponse>({
    queryKey: ["currentUserTasks", params],
    queryFn: () => getCurrentUserTasks(params),
    refetchOnWindowFocus: false,
  });
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
