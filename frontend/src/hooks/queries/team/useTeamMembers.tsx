import { useQuery } from "@tanstack/react-query";
import { getTeamMembers } from "@/api/team.api";
import { SearchUsersFilter } from "@/types/User";
import { UsersApiResponse } from "@/types/User";

/**
 * Récupère les membres d'une équipe
 * @param {string} teamId - identifiant de l'équipe
 * @param {SearchUsersFilter} params - paramètres de la requête
 * @returns la liste desmembres d'une équipe repondant aux critères de recherche
 */
export const useTeamMembers = (
  teamId: string,
  params: SearchUsersFilter = {}
) => {
  const { data, isLoading, isError, refetch } = useQuery<UsersApiResponse>({
    queryKey: ["teamMembers", teamId, params],
    queryFn: () => getTeamMembers(teamId, params),
    refetchOnWindowFocus: true,
  });
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
