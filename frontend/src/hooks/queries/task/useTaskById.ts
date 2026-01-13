import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "@/api/task.api";
import { TaskApiResponse } from "@/types/Task";

/**
 * Récupère la tache ayant l'identifiant passé en paramètre
 * @param {string} id - idetifiant de la tache
 * @returns la tache ayant l'identifiant passé en paramètre
 */
export const useTaskById = (id: string) => {
  const { data, isLoading, isError, refetch } = useQuery<TaskApiResponse>({
    queryKey: ["taskById", id],
    queryFn: () => getTaskById(id),
    refetchOnWindowFocus: false,
  });
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
