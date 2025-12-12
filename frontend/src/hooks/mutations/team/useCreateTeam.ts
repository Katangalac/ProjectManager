import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createTeam } from "../../../services/team.service";
import { CreateTeamData } from "../../../types/Team";

/**
 * Propriété du hook de la mutation de création d'une équipe
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 */
type CreateTeamMutationParams = {
  onSuccess?: () => void;
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
      alert("Erreur lors de la création de l'équipe");
    },
  });
  return {
    createTeam: mutation.mutate,
    createTeamAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
