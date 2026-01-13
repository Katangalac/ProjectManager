import { useQueryClient, useMutation } from "@tanstack/react-query";
import { sendInvitation } from "@/api/invitation.api";
import { CreateInvitationData } from "@/types/Invitation";

/**
 * Propriété du hook de la mutation d'envoie d'une invitation
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 * - onError: fonction à appeller en cas d'erreur
 */
type SendMessageParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

/**
 * Mutation d'envoie d'une invitation
 * @param {CreateInvitationData} data - données de l'invitation
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useSendInvitation = (params: SendMessageParams = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: CreateInvitationData) => {
      await sendInvitation(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamInvitations"] });
      params.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      params.onError?.();
    },
  });
  return {
    sendInvitation: mutation.mutate,
    sendInvitationAsync: mutation.mutateAsync,
    isSending: mutation.isPending,
    error: mutation.error,
  };
};
