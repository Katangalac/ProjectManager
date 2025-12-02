import { axiosClient } from "../lib/axios/axiosClient";
import axios from "axios";

/**
 * Récupère les tâches de l'utilisateur courant
 * En cas d'erreur, lance une exception avec le message d'erreur
 *
 * @returns - La liste des tâches de l'utilisateur courant
 * @throws - Une erreur si la requête échoue
 */
export const getCurrentUserTasks = async () => {
  try {
    const axiosResponse = await axiosClient.get("/users/me/tasks");
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error(
      "Erreur inconnue lors de la récupération des tâches de l'utilisateur"
    );
  }
};

/**
 * Récupère les tâches d'un projet donné
 * En cas d'erreur, lance une exception avec le message d'erreur
 *
 * @param {string} projectId - L'ID du projet
 * @returns - La liste des tâches du projet
 * @throws - Une erreur si la requête échoue
 */
export const getProjectTasks = async (projectId: string) => {
  try {
    const axiosResponse = await axiosClient.get(`/projects/${projectId}/tasks`);
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error(
      "Erreur inconnue lors de la récupération des tâches du projet"
    );
  }
};
