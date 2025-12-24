import { axiosClient } from "../lib/axios/axiosClient";
import axios from "axios";
import { SearchMessagesFilter } from "@/types/Message";

/**
 * Récupère les messages d'une conversation correspondant aux paramètres de recherche
 * En cas d'erreur, lance une exception avec le message d'erreur
 *
 * @param {SearchMessagesFilter} params - les paramètres de la requête
 * @returns - La liste des messages de la conversation
 * @throws - Une erreur si la requête échoue
 */
export const getConversationMessages = async (
  conversationId: string,
  params: SearchMessagesFilter
) => {
  try {
    const axiosResponse = await axiosClient.get(
      `/conversations/${conversationId}/messages`,
      {
        params,
      }
    );
    return axiosResponse.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur inconnue lors de la récupération des messages");
  }
};
