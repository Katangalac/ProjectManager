import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/user.api";
import { SearchUsersFilter } from "@/types/User";
import { UsersApiResponse } from "@/types/User";

/**
 * Récupère les utilisateurs repondant aux critères de recherche
 * @param {SearchUsersFilter} params - paramètres de la requête
 * @returns la liste des utilisateurs repondant aux critères de recherche
 */
export const useUsers = (params: SearchUsersFilter) => {
  const { data, isLoading, isError, refetch } = useQuery<UsersApiResponse>({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    refetchOnWindowFocus: false,
  });
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
