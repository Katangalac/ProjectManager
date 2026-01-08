import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteTeam } from "../../../api/team.api";

/**
 * Propriété du hook de la mutation de suppression d'une équipe
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 * - onError: fonction à appeller en cas d'erreur
 */
type DeleteTeamMutationParams = {
  onSuccess?: () => void;
  onError?: () => void;
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
      params.onError?.();
    },
  });

  return {
    deleteTeam: mutation.mutate,
    deleteTeamAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
};
