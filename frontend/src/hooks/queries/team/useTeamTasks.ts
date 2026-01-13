import { useQuery } from "@tanstack/react-query";
import { getTeamTasks } from "../../../api/team.api";
import { SearchTasksFilter } from "@/types/Task";
import { TasksApiResponse } from "@/types/Task";

/**
 * Récupère les tâches d'une équipe'
 * @param {SearchTasksFilter} params - paramètres de la requête
 * @returns la liste des tâches d'une équipe repondant aux critères de recherche
 */
export const useTeamTasks = (teamId: string, params: SearchTasksFilter) => {
  const { data, isLoading, isError, refetch } = useQuery<TasksApiResponse>({
    queryKey: ["teamTasks", teamId, params],
    queryFn: () => getTeamTasks(teamId, params),
    refetchOnWindowFocus: false,
  });
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
