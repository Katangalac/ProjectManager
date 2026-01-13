import { useQueryClient, useMutation } from "@tanstack/react-query";
import { removeTeamFromProject } from "@/api/project.api";

/**
 * Propriété du hook de la mutation de retrait d'une équipe d'un projet
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 * - onError: fonction à appeller en cas d'erreur
 */
type removeTeamMutationParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

/**
 * Mutation de retrait d'une équipe d'un projet
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useRemoveTeam = (params: removeTeamMutationParams = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: { projectId: string; teamId: string }) => {
      await removeTeamFromProject(data.projectId, data.teamId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProjects"] });
      queryClient.invalidateQueries({ queryKey: ["currentUserProject"] });
      params.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      params.onError?.();
    },
  });
  return {
    removeTeamFromProject: mutation.mutate,
    removeTeamFromProjectAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
