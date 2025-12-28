import { useQueryClient, useMutation } from "@tanstack/react-query";
import { CreateMessageData } from "@/types/Message";
import { sendMessage } from "@/services/conversation.services";
import { socket } from "@/lib/socket/socketClient";

/**
 * Propriété du hook de la mutation de création d'un message
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 */
type CreateMessageMutationParams = {
  onSuccess?: () => void;
};

/**
 * Mutation de création d'un nouveau message
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useCreateMessage = (params: CreateMessageMutationParams = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: CreateMessageData) => {
      const message = await sendMessage(data);
      socket.emit("send_message", message);
      console.log("MESSAGE-SEND", message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversationMessages"] });
      params.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      alert("Erreur lors de la création du message");
    },
  });
  return {
    createMessage: mutation.mutate,
    createMessageAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
