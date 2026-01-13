import { axiosClient } from "../lib/axios/axiosClient";
import axios from "axios";
import { socket } from "@/lib/socket/socketClient";
import { AppError } from "@/errors/AppError";
import { UpdatePasswordData } from "@/types/Auth";

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
    socket.connect();
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message =
        error.response?.data?.error?.message ||
        "An error occur while logging in";
      const code = error.response?.data?.error?.code || "UNKNOWN_ERROR";
      throw new AppError(message, code);
    }

    throw new AppError("An error occur while logging in");
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
    socket.disconnect();
    console.log(axiosResponse.data);
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message =
        error.response?.data?.error?.message ||
        "An error occur while logging out";
      const code = error.response?.data?.error?.code || "UNKNOWN_ERROR";
      throw new AppError(message, code);
    }
    throw new AppError("An error occur while logging out");
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
        err.response?.data?.error?.message || "An error occur while signing up";
      const code = err.response?.data?.error?.code || "UNKNOWN_ERROR";
      throw new AppError(message, code);
    }

    throw new AppError("An error occur while signing up");
  }
};

export const updatePassword = async (input: UpdatePasswordData) => {
  try {
    const axiosResponse = await axiosClient.patch("/auth/me/password", input);
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message =
        error.response?.data?.error?.message ||
        "An error occur while updating the password";
      const code = error.response?.data?.error?.code || "UNKNOWN_ERROR";
      throw new AppError(message, code);
    }

    throw new AppError("An error occur while updating the password");
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

/**
 * Récupère le status de connexion d'un utilisateur par son ID
 *
 * @param {string} userId - L'ID de l'utilisateur
 * @returns - Le status de connexion de l'utilisateur
 * @throws - Une erreur si la requête échoue
 */
export const getUserStatus = async (userId: string) => {
  try {
    const axiosResponse = await axiosClient.get(`/users/${userId}/status`);
    return axiosResponse.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message =
        error.response?.data?.message ||
        "Erreur lors de la récupération du status de l'utilisateur";
      throw new Error(message);
    }

    throw new Error(
      "Erreur inconnue lors de la récupération du status de l'utilisateur"
    );
  }
};
