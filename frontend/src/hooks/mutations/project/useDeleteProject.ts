import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteProject } from "@/services/project.services";

/**
 * Propriété du hook de la mutation de suppression d'un projet
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 */
type DeleteProjectMutationParams = {
  onSuccess?: () => void;
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
      alert("Erreur lors de la suppression du projet");
    },
  });

  return {
    deleteProject: mutation.mutate,
    deleteProjectAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
};
