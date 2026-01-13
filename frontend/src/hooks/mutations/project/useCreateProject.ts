import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createProject } from "@/api/project.api";
import { CreateProjectData } from "@/types/Project";

/**
 * Propriété du hook de la mutation de création d'un projet
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 * - onError: fonction à appeller en cas d'erreur
 */
type CreateProjectMutationParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

/**
 * Mutation de création d'un nouveau projet
 * @param {string} projectId - identifiant du projet
 * @param {CreateProjectData} data - données du projet
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useCreateProject = (params: CreateProjectMutationParams = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: CreateProjectData) => {
      await createProject(data);
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
    createProject: mutation.mutate,
    createProjectAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
