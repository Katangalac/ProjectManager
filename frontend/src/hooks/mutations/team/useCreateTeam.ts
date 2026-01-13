import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createTeam } from "../../../api/team.api";
import { CreateTeamData } from "../../../types/Team";

/**
 * Propriété du hook de la mutation de création d'une équipe
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 * - onError: fonction à appeller en cas d'erreur
 */
type CreateTeamMutationParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

/**
 * Mutation de création d'une nouvelle équipe
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useCreateTeam = (params: CreateTeamMutationParams = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: CreateTeamData) => {
      await createTeam(data);
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
    createTeam: mutation.mutate,
    createTeamAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
