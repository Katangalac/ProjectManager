import { useQuery } from "@tanstack/react-query";
import { getProjectTasks } from "@/services/project.services";
import { SearchTasksFilter } from "@/types/Task";
import { TaskWithRelations } from "@/types/Task";

/**
 * Récupère les tâches d'un projet
 * @param {string} projectId - identifiant du projet
 * @param {SearchMessagesFilter} params - paramètres de la requête
 * @returns la liste des tâches d'un projet repondant aux critères de recherche
 */
export const useProjectTasks = (
  projectId: string,
  params: SearchTasksFilter
) => {
  const { data, isLoading, isError, refetch } = useQuery<TaskWithRelations[]>({
    queryKey: ["projectTasks", projectId, params],
    queryFn: () => getProjectTasks(projectId, params),
    refetchOnWindowFocus: true,
  });
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
