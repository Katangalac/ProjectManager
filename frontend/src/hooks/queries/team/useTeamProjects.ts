import { useQuery } from "@tanstack/react-query";
import { getTeamProjects } from "../../../services/team.service";
import { SearchProjectsFilter } from "@/types/Project";
import { Project } from "@/types/Project";

/**
 * Récupère les projets d'une équipe'
 * @param {SearchProjectsFilter} params - paramètres de la requête
 * @returns la liste des projets d'une équipe repondant aux critères de recherche
 */
export const useTeamProjects = (
  teamId: string,
  params: SearchProjectsFilter
) => {
  const { data, isLoading, isError, refetch } = useQuery<Project[]>({
    queryKey: ["teamProjects", teamId, params],
    queryFn: () => getTeamProjects(teamId, params),
    refetchOnWindowFocus: false,
  });
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
