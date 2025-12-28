import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateTeamMemberRole } from "../../../services/team.service";

/**
 * Propriété du hook de la mutation de modification du role d'un membre dans une équipe
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 */
type updateMemberMutationParams = {
  onSuccess?: () => void;
};

/**
 * Mutation de de modification du role d'un membre dans une équipe
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useUpdateMember = (params: updateMemberMutationParams = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: {
      teamId: string;
      memberId: string;
      memberRole: string;
    }) => {
      await updateTeamMemberRole(data.teamId, data.memberId, data.memberRole);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserTeams"] });
      queryClient.invalidateQueries({ queryKey: ["currentUserTeam"] });
      params.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      alert("Erreur lors de la modification du membre dans l'équipe");
    },
  });
  return {
    updateTeamMemberRole: mutation.mutate,
    updateTeamMemberRoleAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
