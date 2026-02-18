import { useMutation } from "@tanstack/react-query";
import { deleteMe } from "@/api/auth.api";

/**
 * Propriété du hook de la mutation de suppression d'un compte utilisateur
 *
 * - onSuccess: fonction à appeler en cas de succès de la mutation. Peut ne pas être défini
 */
type DeleteAccountMutationParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

/**
 * Mutation de suppression d'un compte utilisateur
 * @returns la fontion de mutation ainsi que le status de la requête
 */
export const useDeleteAccount = (params: DeleteAccountMutationParams = {}) => {
  const mutation = useMutation({
    mutationFn: async () => {
      return await deleteMe();
    },

    onSuccess: () => {
      params.onSuccess?.();
    },

    onError: (error) => {
      console.error("Erreur suppression du compte :", error);
      params.onError?.();
    },
  });

  return {
    deleteAccount: mutation.mutate,
    deleteAccountAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
};
