import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteTeam } from "../../../services/team.service";

/**
 * Propriété du hook de la mutation de suppression d'une équipe
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 */
type DeleteTeamMutationParams = {
  onSuccess?: () => void;
};

/**
 * Mutation de suppression d'une nouvelle équipe
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useDeleteTeam = (params: DeleteTeamMutationParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (teamId: string) => {
      return await deleteTeam(teamId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserTeams"] });
      params.onSuccess?.();
    },

    onError: (error) => {
      console.error(error);
      alert("Erreur lors de la suppression de l'équipe");
    },
  });

  return {
    deleteTeam: mutation.mutate,
    deleteTeamAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
};
