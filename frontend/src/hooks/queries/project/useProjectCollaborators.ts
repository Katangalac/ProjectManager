import { useQuery } from "@tanstack/react-query";
import { getProjectCollaborators } from "@/api/project.api";
import { SearchUsersFilter } from "@/types/User";
import { User } from "@/types/User";

/**
 * Récupère les collaborateurs d'un projet
 * @param {string} projectId - identifiant du projet
 * @param {SearchUsersFilter} params - paramètres de la requête
 * @returns la liste des collaborateurs d'un projet repondant aux critères de recherche
 */
export const useProjectCollaborators = (
  projectId: string,
  params: SearchUsersFilter
) => {
  const { data, isLoading, isError, refetch } = useQuery<User[]>({
    queryKey: ["projectCollaborators", projectId, params],
    queryFn: () => getProjectCollaborators(projectId, params),
    refetchOnWindowFocus: true,
  });
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
