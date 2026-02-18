import { useQuery } from "@tanstack/react-query";
import { getUserNotifications } from "@/api/user.api";
import { NotificationsApiResponse } from "@/types/Notification";
import { SearchNotificationsFilter } from "@/types/Notification";

/**
 * Récupère les notifications de l'utilisateur courant
 * @returns la liste notifications de l'utilisateur courant
 */
export const useUserNotifications = (params: SearchNotificationsFilter) => {
  const { data, isLoading, isError, refetch } = useQuery<NotificationsApiResponse>({
    queryKey: ["userNotifications", JSON.stringify(params)],
    queryFn: () => getUserNotifications(params),
    refetchOnWindowFocus: true,
  });
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
