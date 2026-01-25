import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createConversation } from "@/api/conversation.api";
import { ConversationHookInput } from "@/types/Conversation";
import { socket } from "@/lib/socket/socketClient";
import { userStore } from "@/stores/userStore";
import { useCreateMessage } from "../message/useCreateMessage";

/**
 * Propriété du hook de la mutation de création d'une conversation
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 * - onError: fonction à appeller en cas d'erreur
 */
type CreateConversationMutationParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

/**
 * Mutation de création d'une conversation
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useCreateConversation = (
  params: CreateConversationMutationParams = {}
) => {
  const { user } = userStore();
  const queryClient = useQueryClient();
  const { createMessage } = useCreateMessage();

  const mutation = useMutation({
    mutationFn: async (data: ConversationHookInput) => {
      const { message, ...conversationData } = data;
      const conversation = await createConversation(conversationData);
      if (conversation.data.teamId) {
        socket.emit("new_conversation", conversation.data.teamId);
      }
      await createMessage({
        conversationId: conversation.data.id,
        senderId: user!.id,
        content: message,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamConversations"] });
      params.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      params.onError?.();
    },
  });
  return {
    createConversation: mutation.mutate,
    createConversationAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
