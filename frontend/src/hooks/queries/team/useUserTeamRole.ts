import { useQuery } from "@tanstack/react-query";
import { getUserTeamRole } from "../../../api/team.api";
import { TeamRoleApiResponse } from "../../../types/Team";

/**
 * Récupère le role d'un utilisateur dans  une équipe
 * @param {string} teamId - idetifiant de l'équipe
 * @param {string} userId - idetifiant de l'utilisateur
 * @returns le role de l'utilisateur utilisateur
 */
export const useUserTeamRole = (teamId: string, userId: string) => {
  const { data, isLoading, isError, refetch } = useQuery<TeamRoleApiResponse>({
    queryKey: ["userTeamRole", teamId],
    queryFn: () => getUserTeamRole(teamId, userId),
    refetchOnWindowFocus: false,
  });
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
