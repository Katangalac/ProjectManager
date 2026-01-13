import { CreateInvitationData } from "@/types/Invitation";
import { axiosClient } from "../lib/axios/axiosClient";
import axios from "axios";

/**
 * Crée une nouvelle invitation
 * En cas d'erreur, lance une exception avec un message d'erreur
 *
 * @param {CreateInvitationData} invitationData - données de l'invitation
 * @returns - l'invitation créée
 * @throws - Une erreur si la requête échoue
 */
export const sendInvitation = async (invitationData: CreateInvitationData) => {
  try {
    const axiosResponse = await axiosClient.post(
      "/invitations",
      invitationData
    );
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur inconnue lors de la création de l'invitation");
  }
};

/**
 * Récupère l'invitation ayant l'identifiant passé en paramètre
 * En cas d'erreur, lance une exception avec le message d'erreur
 *
 * @param {string} id - identifiant de l'équipe à trouver
 * @returns - L'invitation ayant l'identifiant passé en paramètre
 * @throws - Une erreur si la requête échoue
 */
export const getInvitationById = async (id: string) => {
  try {
    const axiosResponse = await axiosClient.get(`/invitations/${id}`);
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur lors de l arécupération de l'invitation");
  }
};

/**
 * Répond  une invitation
 * En cas d'erreur, lance une exception avec un message d'erreur
 *
 * @param {string} invitationId - identifiant de l'invitation
 * @returns - l'invitation mise à jour
 * @throws - Une erreur si la requête échoue
 */
export const replyToInvitation = async (
  invitationId: string,
  accept: boolean
) => {
  try {
    const reply = accept ? "accept" : "reject";
    const axiosResponse = await axiosClient.post(
      `/invitations/${invitationId}/${reply}`
    );
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur inconnue lors de la mise à jour de l'invitation");
  }
};

/**
 * Suppprime une invitation
 *
 * @param {string} invitationId - identifiant de l'invitation'
 * @throws - Une erreur si la requête échoue
 * @throws - Une erreur si la requête échoue
 */
export const deleteInvitation = async (invitationId: string) => {
  try {
    const axiosResponse = await axiosClient.delete(
      `/invitations/${invitationId}`
    );
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur inconnue lors de la suppression de l'invitation");
  }
};
