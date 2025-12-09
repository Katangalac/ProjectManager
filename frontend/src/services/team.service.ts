import { axiosClient } from "../lib/axios/axiosClient";
import axios from "axios";
import { SearchTeamsFilter } from "../types/Team";

/**
 * Récupère les équipes de l'utilisateur courant correspondant aux paramètres de recherche
 * En cas d'erreur, lance une exception avec le message d'erreur
 *
 * @param {SearchTasksFilter} params - les paramètres de la requête
 * @returns - La liste des équipes de l'utilisateur courant
 * @throws - Une erreur si la requête échoue
 */
export const getUserTeams = async (params: SearchTeamsFilter) => {
  try {
    const axiosResponse = await axiosClient.get("/users/me/teams", { params });
    return axiosResponse.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error(
      "Erreur lors de l arécupération des équipes de l'utilisateur"
    );
  }
};
