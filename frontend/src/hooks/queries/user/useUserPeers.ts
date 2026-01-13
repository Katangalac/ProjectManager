import { useQuery } from "@tanstack/react-query";
import { getUserPeers } from "@/api/user.api";
import { UsersApiResponse } from "@/types/User";

/**
 * Récupère les coéquipiers de l'utilisateur courant
 * @returns la liste coéquipiers de l'utilisateur courant
 */
export const useUserPeers = () => {
  const { data, isLoading, isError, refetch } = useQuery<UsersApiResponse>({
    queryKey: ["userPeers"],
    queryFn: () => getUserPeers(),
    refetchOnWindowFocus: false,
  });
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
