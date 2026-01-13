import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteInvitation } from "@/api/invitation.api";

/**
 * Propriété du hook de la mutation de suppression d'une invitation
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 */
type DeleteInvitationMutationParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

/**
 * Mutation de suppression d'une invitation
 * @param {invitationId} - Identifiant de l'invitation à supprimer
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useDeleteInvitation = (
  params: DeleteInvitationMutationParams = {}
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (invitationId: string) => {
      return await deleteInvitation(invitationId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitationById"] });
      queryClient.invalidateQueries({ queryKey: ["teamInvitations"] });
      params.onSuccess?.();
    },

    onError: (error) => {
      console.error("Erreur suppression de l'invitation :", error);
      params.onError?.();
    },
  });

  return {
    deleteInvitation: mutation.mutate,
    deleteInvitationAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
};
