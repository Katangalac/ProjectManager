import { useQuery } from "@tanstack/react-query";
import { getConversationMessages } from "@/api/conversation.api";
import { SearchMessagesFilter } from "@/types/Message";
import { MessageWithRelation } from "@/types/Message";

/**
 * Récupère les messages d'une conversation
 * @param {SearchMessagesFilter} params - paramètres de la requête
 * @returns la liste des messages d'une conversation repondant aux critères de recherche
 */
export const useConversationMessages = (
  conversationId: string,
  params: SearchMessagesFilter
) => {
  const { data, isLoading, isError, refetch } = useQuery<MessageWithRelation[]>(
    {
      queryKey: ["conversationMessages", conversationId, params],
      queryFn: () => getConversationMessages(conversationId, params),
      refetchOnWindowFocus: true,
    }
  );
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
