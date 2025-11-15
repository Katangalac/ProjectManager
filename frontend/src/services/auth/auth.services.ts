import { axiosClient } from "../../lib/axiosClient";
import axios from "axios";

/**
 * Envoie une requête de connexion 
 * @param {string} identifier - identifiant de l'utilisateur (username ou email)
 * @param {string} password - le mot de passe de l'utilisateur
 * @returns l'utilisateur connecté
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
};

/**
 * Envoie une requête d'inscription
 * @param {string} userName - nom d'utilisateur
 * @param {string} email - email de l'utilisateur
 * @param {string} password - le mot de passe de l'utilisateur
 */
export const registerRequest = async (userName: string, email: string, password: string) => {
    try {
        const response = await axiosClient.post("/auth/register", {
            userName,
            email,
            password,
        });
        return response.data; 
    } catch (err: unknown) {
        if (axios.isAxiosError?.(err)) {
            const message = err.response?.data?.message || "Erreur lors de l'inscription";
            throw new Error(message);
        }

        throw new Error("Erreur inconnue lors de l'inscription");
    }
};