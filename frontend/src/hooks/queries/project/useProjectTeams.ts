import { useQuery } from "@tanstack/react-query";
import { getProjectTeams } from "@/api/project.api";
import { SearchTeamsFilter } from "@/types/Team";
import { TeamsApiResponse } from "@/types/Team";

/**
 * Récupère les équipes d'un projet
 * @param {string} projectId - identifiant du projet
 * @param {SearchMessagesFilter} params - paramètres de la requête
 * @returns la liste des équipes d'un projet repondant aux critères de recherche
 */
export const useProjectTeams = (
  projectId: string,
  params: SearchTeamsFilter
) => {
  const { data, isLoading, isError, refetch } = useQuery<TeamsApiResponse>({
    queryKey: ["projectTeams", projectId, params],
    queryFn: () => getProjectTeams(projectId, params),
    refetchOnWindowFocus: true,
  });
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
