import { useQuery } from "@tanstack/react-query";
import { getUserProjects } from "../../../services/project.services";
import { SearchProjectsFilter } from "../../../types/Project";
import { Project } from "../../../types/Project";

/**
 * Récupère les projets de l'utilisaeur courant
 * @param {SearchProjectsFilter} params - paramètres de la requête
 * @returns la liste des projets repondant aux critères de recherche
 */
export const useProjects = (params: SearchProjectsFilter) => {
  const { data, isLoading, isError, refetch } = useQuery<Project[]>({
    queryKey: ["currentUserProjects", params],
    queryFn: () => getUserProjects(params),
    refetchOnWindowFocus: false,
  });
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
