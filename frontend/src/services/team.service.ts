import { axiosClient } from "../lib/axios/axiosClient";
import axios from "axios";
import {
  SearchTeamsFilter,
  UpdateTeamData,
  CreateTeamData,
} from "../types/Team";
import { SearchConversationsFilter } from "@/types/Conversation";

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

/**
 * Récupère l'équipe de l'utilisateur ayant l'identifiant passé en paramètre
 * En cas d'erreur, lance une exception avec le message d'erreur
 *
 * @param {string} id - identifiant de l'équipe à trouver
 * @returns - L'équipe de l,utilisateur ayant l'identifiant passé en paramètre
 * @throws - Une erreur si la requête échoue
 */
export const getUserTeamById = async (id: string) => {
  try {
    const axiosResponse = await axiosClient.get(`/users/me/teams/${id}`);
    return axiosResponse.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error(
      "Erreur lors de l arécupération de l'équipe de l'utilisateur"
    );
  }
};

export const createTeam = async (teamData: CreateTeamData) => {
  try {
    const axiosResponse = await axiosClient.post("/teams", teamData);
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur inconnue lors de la création de l'équipe");
  }
};

/**
 *
 * @param teamId
 * @param teamData
 * @returns
 */
export const updateTeam = async (teamId: string, teamData: UpdateTeamData) => {
  try {
    const axiosResponse = await axiosClient.patch(`/teams/${teamId}`, teamData);
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur inconnue lors de la mise à jour de l'équipe");
  }
};

/**
 *
 * @param teamId
 * @returns
 */
export const deleteTeam = async (teamId: string) => {
  try {
    const axiosResponse = await axiosClient.delete(`/teams/${teamId}`);
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur inconnue lors de la suppression de l'équipe");
  }
};

export const getTeamConversations = async (
  teamId: string,
  params: SearchConversationsFilter
) => {
  try {
    const axiosResponse = await axiosClient.get(
      `/teams/${teamId}/conversations`,
      { params }
    );
    return axiosResponse.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error(
      "Erreur inconnue lors de la récupération des conversations de l'équipe"
    );
  }
};
