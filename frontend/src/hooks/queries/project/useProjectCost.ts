import { useQuery } from "@tanstack/react-query";
import { getProjectTotalCost } from "@/api/project.api";
import { ProjectTotalCostApiResponse } from "@/types/Project";

/**
 * Calcul le cout total du projet ayant l'id passé en paramètre
 * @param {string} projectId - identifiant du projet
 * @returns le cout du projet ayant l'id passé en paramètre
 */
export const useProjectCost = (projectId: string) => {
  const { data, isLoading, isError, refetch } =
    useQuery<ProjectTotalCostApiResponse>({
      queryKey: ["projectCost", projectId],
      queryFn: () => getProjectTotalCost(projectId),
      refetchOnWindowFocus: true,
    });
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
