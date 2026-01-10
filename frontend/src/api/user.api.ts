import { axiosClient } from "../lib/axios/axiosClient";
import axios from "axios";
import { SearchUsersFilter, UpdateUserData } from "../types/User";
import { SearchNotificationsFilter } from "@/types/Notification";

/**
 * Récupère un utilisateur par son ID
 *
 * @param {string} userId - L'ID de l'utilisateur à récupérer
 * @returns - Les données de l'utilisateur
 * @throws - Une erreur si la requête échoue
 */
export const getUserById = async (userId: string) => {
  try {
    const axiosResponse = await axiosClient.get(`/users/${userId}`);
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message =
        error.response?.data?.message ||
        "Erreur lors de la récupération de l'utilisateur";
      throw new Error(message);
    }

    throw new Error("Erreur inconnue lors de la récupération de l'utilisateur");
  }
};

/**
 * Récupère la liste de tous les utilisateurs
 *
 * @returns - La liste des utilisateurs
 * @throws - Une erreur si la requête échoue
 */
export const getUsers = async (params: SearchUsersFilter) => {
  try {
    const axiosResponse = await axiosClient.get(`/users`, { params });
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message =
        error.response?.data?.message ||
        "Erreur lors de la récupération des utilisateurs";
      throw new Error(message);
    }

    throw new Error("Erreur inconnue lors de la récupération des utilisateurs");
  }
};

/**
 * Récupère la liste des coéquipiers d'un utilisateur
 *
 * @returns - La liste des coéquipiers d'un utilisateur
 * @throws - Une erreur si la requête échoue
 */
export const getUserPeers = async () => {
  try {
    const axiosResponse = await axiosClient.get(`/users/me/peers`);
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message =
        error.response?.data?.message ||
        "Erreur lors de la récupération des coequipiers";
      throw new Error(message);
    }

    throw new Error("Erreur inconnue lors de la récupération des coequipiers");
  }
};

/**
 * Met à jour les informations de l'utilisateur connecté
 *
 * @param {UpdateUserData}  updateUserInput - Les nouvelles données de l'utilisateur
 * @returns - Les données mises à jour de l'utilisateur
 * @throws - Une erreur si la requête échoue
 */
export const updateUser = async (updateUserInput: UpdateUserData) => {
  try {
    const axiosResponse = await axiosClient.patch("/users/me", updateUserInput);
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        "Erreur lors de la modification de l'utilisateur";
      throw new Error(message);
    }
    throw new Error("Erreur inconnue lors de la modification de l'utilisateur");
  }
};

/**
 * Récupère la liste des notifications d'un utilisateur
 *
 * @param {SearchNotificationsFilter} - paramètres de recherche
 * @returns - La liste des notifications d'un utilisateur
 * @throws - Une erreur si la requête échoue
 */
export const getUserNotifications = async (
  params: SearchNotificationsFilter
) => {
  try {
    const axiosResponse = await axiosClient.get(`/users/me/notifications`, {
      params,
    });
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message =
        error.response?.data?.message ||
        "Erreur lors de la récupération des notification";
      throw new Error(message);
    }

    throw new Error(
      "Erreur inconnue lors de la récupération des notifications"
    );
  }
};

/**
 * Marqu'une notification comme lu par l'utilisateur(destinataire)
 *
 * @param {string } notificationId - identifiant de la notification
 * @returns - La notification mise à jour
 * @throws - Une erreur si la requête échoue
 */
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const axiosResponse = await axiosClient.patch(
      `/notifications/${notificationId}/read`
    );
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message =
        error.response?.data?.message ||
        "Erreur lors de la mise à jour de la notification";
      throw new Error(message);
    }

    throw new Error(
      "Erreur inconnue lors de la mise à jour de la notification"
    );
  }
};
