import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/api/project.api";
import { ProjectApiResponse } from "@/types/Project";

/**
 * Récupère le projet ayant l'id passé en paramètre
 * @param {string} projectId - identifiant du projet
 * @returns le projet ayant l'id passé en paramètre
 */
export const useProjectById = (projectId: string) => {
  const { data, isLoading, isError, refetch } = useQuery<ProjectApiResponse>({
    queryKey: ["currentUserProject", projectId],
    queryFn: () => getProjectById(projectId),
    refetchOnWindowFocus: true,
  });
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
