import { useQueryClient, useMutation } from "@tanstack/react-query";
import { addTeamToProject } from "@/api/project.api";

/**
 * Propriété du hook de la mutation d'ajout d'une équipe dans un projet
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 * - onError: fonction à appeller en cas d'erreur
 */
type AddTeamMutationParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

/**
 * Mutation d'ajout d'une équipe dans un projet
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useAddTeam = (params: AddTeamMutationParams = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: { projectId: string; teamId: string }) => {
      await addTeamToProject(data.projectId, data.teamId);
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
    addTeamToProject: mutation.mutate,
    addTeamToProjectAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
