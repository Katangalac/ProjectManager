import { useQueryClient, useMutation } from "@tanstack/react-query";
import { replyToInvitation } from "@/api/invitation.api";

/**
 * Propriété du hook de la mutation de reponse à une invitation
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 */
type ReplyToInvitationParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

/**
 * Mutation de réponse à une invitation
 * @param {string} invitationId - identifiant de l'invitation
 * @param {boolean} reply - la reponse à l'invitation
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useReplyToInvitation = (params: ReplyToInvitationParams = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      invitationId,
      reply,
    }: {
      invitationId: string;
      reply: boolean;
    }) => {
      await replyToInvitation(invitationId, reply);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitationById"] });
      params.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      params.onError?.();
    },
  });
  return {
    replyToInvitation: mutation.mutate,
    replyToInvitationAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
};
