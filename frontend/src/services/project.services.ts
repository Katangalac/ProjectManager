import { axiosClient } from "../lib/axios/axiosClient";
import axios from "axios";
import { SearchProjectsFilter } from "../types/Project";

/**
 * Récupère les projets de l'utilisateur courant correspondant aux paramètres de recherche
 * En cas d'erreur, lance une exception avec le message d'erreur
 *
 * @param {SearchProjectsFilter} params - les paramètres de la requête
 * @returns - La liste des projets de l'utilisateur courant
 * @throws - Une erreur si la requête échoue
 */
export const getUserProjects = async (params: SearchProjectsFilter) => {
  try {
    const axiosResponse = await axiosClient.get("/users/me/projects", {
      params,
    });
    return axiosResponse.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error(
      "Erreur lors de l arécupération des projets de l'utilisateur"
    );
  }
};
