import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateProject } from "@/api/project.api";
import { UpdateProjectData } from "@/types/Project";

/**
 * Propriété du hook de la mutation de modfication d'un projet
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 * - onError: fonction à appeller en cas d'erreur
 */
type UpdateProjectMutationParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

/**
 * Mutation de modification d'un projet
 * @param {string} projectId - identifiant du projet
 * @param {UpdateProjectData} data - nouvelles données du projet
 * @returns la fonction de mutation ainsi que le status de la requête
 */
export const useUpdateProject = (params: UpdateProjectMutationParams = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      projectId,
      data,
    }: {
      projectId: string;
      data: UpdateProjectData;
    }) => {
      await updateProject(projectId, data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProjects"] });
      params.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      params.onError?.();
    },
  });
  return {
    updateProject: mutation.mutate,
    updateProjectAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
};
