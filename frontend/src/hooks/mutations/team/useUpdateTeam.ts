import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateTeam } from "../../../services/team.service";
import { UpdateTeamData } from "../../../types/Team";

/**
 * Propriété du hook de la mutation de mdofication d'une équipe
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 */
type UpdateTeamMutationParams = {
  onSuccess?: () => void;
};

/**
 * Mutation de modification d'une équipe
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useUpdateTeam = (params: UpdateTeamMutationParams = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      teamId,
      data,
    }: {
      teamId: string;
      data: UpdateTeamData;
    }) => {
      await updateTeam(teamId, data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserTeams"] });
      params.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      alert("Erreur lors de la mise à jour de l'équipe");
    },
  });
  return {
    updateTeam: mutation.mutate,
    updateTeamAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
};
