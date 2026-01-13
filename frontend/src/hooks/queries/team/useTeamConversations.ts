import { useQuery } from "@tanstack/react-query";
import { getTeamConversations } from "../../../api/team.api";
import { SearchConversationsFilter } from "@/types/Conversation";
import { ConversationsApiResponse } from "@/types/Conversation";

/**
 * Récupère les conversations d'une équipe'
 * @param {SearchConversationsFilter} params - paramètres de la requête
 * @returns la liste des conversations d'une équipe repondant aux critères de recherche
 */
export const useTeamConversations = (
  teamId: string,
  params: SearchConversationsFilter
) => {
  const { data, isLoading, isError, refetch } =
    useQuery<ConversationsApiResponse>({
      queryKey: ["teamConversations", teamId, params],
      queryFn: () => getTeamConversations(teamId, params),
      refetchOnWindowFocus: false,
    });
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
