import { useQuery } from "@tanstack/react-query";
import { getUserStatus } from "@/api/auth.api";

/**
 * Récupère le status de l'utilisaeur
 * @param {string} params - Id de l'utilisateur
 * @returns la liste des tâches repondant aux critères de recherche
 */
export const useUserStatus = (userId: string) => {
  const { data, isLoading, isError, refetch } = useQuery<boolean>({
    queryKey: ["userStatus", userId],
    queryFn: () => getUserStatus(userId),
    refetchOnWindowFocus: true,
  });
  return {
    isOnline: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
