import { useQuery } from "@tanstack/react-query";
import { getInvitationById } from "@/api/invitation.api";
import { InvitationApiResponse } from "@/types/Invitation";

/**
 * Récupère l'invitation ayant l'identifiant passé en paramètre
 * @param {string} id - idetifiant de l'invitation
 * @returns l'équipe ayant l'identifiant passé en paramètre
 */
export const useInvitationById = (id: string) => {
  const { data, isLoading, isError, refetch } = useQuery<InvitationApiResponse>(
    {
      queryKey: ["invitationById", id],
      queryFn: () => getInvitationById(id),
      refetchOnWindowFocus: false,
    }
  );
  return {
    data: data,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };
};
