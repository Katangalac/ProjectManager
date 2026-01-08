import { useQueryClient, useMutation } from "@tanstack/react-query";
import { removeMemberFromTeam } from "../../../api/team.api";

/**
 * Propriété du hook de la mutation de retrait d'un membre d'une équipe
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 * - onError: fonction à appeller en cas d'erreur
 */
type RemoveMemberMutationParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

/**
 * Mutation du retrait d'un membre d'une équipe
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useRemoveMember = (params: RemoveMemberMutationParams = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: { teamId: string; memberId: string }) => {
      await removeMemberFromTeam(data.teamId, data.memberId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserTeams"] });
      queryClient.invalidateQueries({ queryKey: ["currentUserTeam"] });
      params.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      params.onError?.();
    },
  });
  return {
    removeMemberToTeam: mutation.mutate,
    removeMemberToTeamAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
