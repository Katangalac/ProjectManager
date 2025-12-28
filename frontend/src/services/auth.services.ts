import { axiosClient } from "../lib/axios/axiosClient";
import axios from "axios";

/**
 * Envoie une requête de connexion
 *
 * @param {string} identifier - identifiant de l'utilisateur (username ou email)
 * @param {string} password - le mot de passe de l'utilisateur
 * @returns l'utilisateur connecté
 * @throws - une erreur si la requête échoue
 */
export async function loginRequest(identifier: string, password: string) {
  try {
    const response = await axiosClient.post("/auth/login", {
      identifier,
      password,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message =
        error.response?.data?.message || "Erreur lors de la connexion";
      throw new Error(message);
    }

    throw new Error("Erreur inconnue lors de la connexion");
  }
}

/**
 * Déconnecte l'utilisateur
 *
 * @returns - un message de succès
 * @throws - une erreur si la requête échoue
 */
export const logoutRequest = async () => {
  try {
    const axiosResponse = await axiosClient.post("/auth/logout");
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message =
        error.response?.data?.message || "Erreur lors de la déconnexion";
      throw new Error(message);
    }
    throw new Error("Erreur inconnue lors de la déconnexion");
  }
};

/**
 * Envoie une requête d'inscription
 *
 * @param {string} userName - nom d'utilisateur
 * @param {string} email - email de l'utilisateur
 * @param {string} password - le mot de passe de l'utilisateur
 * @returns l'utilisateur inscrit
 * @throws - une erreur si la requête échoue
 */
export const registerRequest = async (
  userName: string,
  email: string,
  password: string
) => {
  try {
    const response = await axiosClient.post("/auth/register", {
      userName,
      email,
      password,
    });
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError?.(err)) {
      const message =
        err.response?.data?.message || "Erreur lors de l'inscription";
      throw new Error(message);
    }

    throw new Error("Erreur inconnue lors de l'inscription");
  }
};

/**
 * Récupère les informations de l'utilisateur connecté
 *
 * @returns - le user connecté
 * @throws - une erreur si la requête échoue
 */
export const getMe = async () => {
  try {
    const axiosResponse = await axiosClient.get("/users/me");
    return axiosResponse.data;
  } catch (err: unknown) {
    if (axios.isAxiosError?.(err)) {
      const message =
        err.response?.data?.message ||
        "Erreur lors de la récupération de l'utilisateur";
      throw new Error(message);
    }

    throw new Error("Erreur inconnue lors de la récupération de l'utilisateur");
  }
};

/**
 * Supprime l'utilisateur connecté
 *
 * @throws - une erreur si la requête échoue
 */
export const deleteMe = async () => {
  try {
    const axiosResponse = await axiosClient.get("/users/me");
    return axiosResponse.data;
  } catch (err: unknown) {
    if (axios.isAxiosError?.(err)) {
      const message =
        err.response?.data?.message ||
        "Erreur lors de la suppression de l'utilisateur";
      throw new Error(message);
    }

    throw new Error("Erreur inconnue lors de la suppression de l'utilisateur");
  }
};
