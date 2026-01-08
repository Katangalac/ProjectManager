import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteProject } from "@/api/project.api";

/**
 * Propriété du hook de la mutation de suppression d'un projet
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 * - onError: fonction à appeller en cas d'erreur
 */
type DeleteProjectMutationParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

/**
 * Mutation de suppression d'un projet
 * @param {string} projectId - identifiant du projet
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useDeleteProject = (params: DeleteProjectMutationParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (projectId: string) => {
      return await deleteProject(projectId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProjects"] });
      params.onSuccess?.();
    },

    onError: (error) => {
      console.error("Erreur suppression du projet :", error);
      params.onError?.();
    },
  });

  return {
    deleteProject: mutation.mutate,
    deleteProjectAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
};
