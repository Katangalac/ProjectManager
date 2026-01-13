import { useQuery } from "@tanstack/react-query";
import { getUserTeamById } from "../../../api/team.api";
import { TeamApiResponse } from "../../../types/Team";

/**
 * Récupère l'équipe de l'utilisaeur courant ayant l'identifiant passé en paramètre
 * @param {string} id - idetifiant de l'équipe
 * @returns l'équipe ayant l'identifiant passé en paramètre
 */
export const useTeamById = (id: string) => {
  const { data, isLoading, isError, refetch } = useQuery<TeamApiResponse>({
    queryKey: ["currentUserTeam", id],
    queryFn: () => getUserTeamById(id),
    refetchOnWindowFocus: false,
  });
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
