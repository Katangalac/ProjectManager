import { useQuery } from "@tanstack/react-query";
import { getTeamInvitations } from "../../../api/team.api";
import { SearchInvitationFilter } from "@/types/Invitation";
import { InvitationsCollectionApiResponse } from "@/types/Invitation";

/**
 * Récupère les invitations d'une équipe'
 * @param {SearchInvitationFilter} params - paramètres de la requête
 * @returns la liste des invitations d'une équipe repondant aux critères de recherche
 */
export const useTeamInvitations = (
  teamId: string,
  params: SearchInvitationFilter
) => {
  const { data, isLoading, isError, refetch } =
    useQuery<InvitationsCollectionApiResponse>({
      queryKey: ["teamInvitations", teamId, params],
      queryFn: () => getTeamInvitations(teamId, params),
      refetchOnWindowFocus: false,
    });
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
