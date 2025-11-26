import { axiosClient } from "../lib/axiosClient";
import axios from "axios";
import { UpdateUserData } from "../types/User";

/**
 *
 * @param userId
 * @returns
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
 *
 * @returns
 */
export const getUsers = async () => {
  try {
    const axiosResponse = await axiosClient.get(`/users`);
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
