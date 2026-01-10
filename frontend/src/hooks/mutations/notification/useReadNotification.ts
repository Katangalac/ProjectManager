import { useQueryClient, useMutation } from "@tanstack/react-query";
import { markNotificationAsRead } from "@/api/user.api";

/**
 * Propriété du hook de la mutation
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 * - onError: fonction à appeller en cas d'erreur
 */
type ReadNotificationParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

/**
 * Mutation de lecture d'une notification
 * @param {string} notificationId - identifiant de la notification
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useReadNotification = (params: ReadNotificationParams = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await markNotificationAsRead(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
      params.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      params.onError?.();
    },
  });
  return {
    readNotification: mutation.mutate,
    readNotificationAsync: mutation.mutateAsync,
    isReading: mutation.isPending,
    error: mutation.error,
  };
};
