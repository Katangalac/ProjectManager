import { useQuery } from "@tanstack/react-query";
import { getUserTeamById } from "../../../services/team.service";
import { TeamWithRelations } from "../../../types/Team";

/**
 * Récupère l'équipe de l'utilisaeur courant ayant l'identifiant passé en paramètre
 * @param {string} id - idetifiant de l'équipe
 * @returns l'équipe ayant l'identifiant passé en paramètre
 */
export const useTeamById = (id: string) => {
  const { data, isLoading, isError, refetch } = useQuery<TeamWithRelations>({
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
