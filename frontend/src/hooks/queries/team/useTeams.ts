import { useQuery } from "@tanstack/react-query";
import { getUserTeams } from "../../../api/team.api";
import { SearchTeamsFilter } from "../../../types/Team";

/**
 * Récupère les équipes de l'utilisaeur courant
 * @param {SearchTeamsFilter} params - paramètres de la requête
 * @returns la liste des équipes repondant aux critères de recherche
 */
export const useTeams = (params: SearchTeamsFilter) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["currentUserTeams", params],
    queryFn: () => getUserTeams(params),
    refetchOnWindowFocus: false,
  });
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
