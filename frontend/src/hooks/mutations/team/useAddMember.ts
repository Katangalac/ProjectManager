import { useQueryClient, useMutation } from "@tanstack/react-query";
import { addMemberToTeam } from "../../../services/team.service";

/**
 * Propriété du hook de la mutation d'ajout d'un membre dans une équipe
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 */
type AddMemberMutationParams = {
  onSuccess?: () => void;
};

/**
 * Mutation d'ajout d'un membre dans une équipe
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useAddMember = (params: AddMemberMutationParams = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: {
      teamId: string;
      memberId: string;
      memberRole: string;
    }) => {
      await addMemberToTeam(data.teamId, data.memberId, data.memberRole);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserTeams"] });
      queryClient.invalidateQueries({ queryKey: ["currentUserTeam"] });
      params.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      alert("Erreur lors de l'ajout du membre dans l'équipe");
    },
  });
  return {
    addMemberToTeam: mutation.mutate,
    addMemberToTeamAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
