import { useQuery } from "@tanstack/react-query";
import { getUserUnreadNotificationsCount } from "@/api/user.api";

/**
 * Récupère le nombre de notifications non lues de l'utilisateur courant
 * @returns le nombre de notifications non lues de l'utilisateur courant
 */
export const useUserUnreadNotificationsCount = () => {
  const { data, isLoading, isError, refetch } = useQuery<number>({
    queryKey: ["userUnreadNotifications"],
    queryFn: () => getUserUnreadNotificationsCount(),
    refetchOnWindowFocus: true,
  });
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
