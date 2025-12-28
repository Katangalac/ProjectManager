import { axiosClient } from "../lib/axios/axiosClient";
import axios from "axios";
import {
  SearchTeamsFilter,
  UpdateTeamData,
  CreateTeamData,
} from "../types/Team";
import { SearchConversationsFilter } from "@/types/Conversation";
import { SearchTasksFilter } from "@/types/Task";
import { SearchProjectsFilter } from "@/types/Project";

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

/**
 * Crée une nouvelle équipe
 * En cas d'erreur, lance une exception avec un message d'erreur
 *
 * @param {CreateTeamData} teamData - données de l'équipe
 * @returns - l'équipe créée
 * @throws - Une erreur si la requête échoue
 */
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
 * Met à jour une équipe
 * En cas d'erreur, lance une exception avec un message d'erreur
 *
 * @param {string} teamId - identifiant de l'équipe
 * @param {UpdateTeamData} teamData - nouvelles données de l'équipe
 * @returns - l'équipe mise à jour
 * @throws - Une erreur si la requête échoue
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
 * Supprime une équipe
 * En cas d'erreur, lance une exception avec un message d'erreur
 *
 * @param {string} teamId - identifiant de l'équipe
 * @throws - Une erreur si la requête échoue
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

/**
 * Récupère les conversations d'une équipe
 * En cas d'erreur, lance une exception avec un message d'erreur
 *
 * @param {string} teamId - identifiant de l'équipe
 * @param {SearchConversationsFilter} params - paramètres de recherche
 * @returns la liste des conversations d'une équipe
 * @throws - Une erreur si la requête échoue
 */
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

/**
 * Récupère les tâches d'une équipe
 * En cas d'erreur, lance une exception avec un message d'erreur
 *
 * @param {string} teamId - identifiant du projet
 * @param {SearchTasksFilter} params - paramètres de recherche des tâches
 * @returns la liste des taches d'une équipe repondant aux critères de recherche
 * @throws - Une erreur si la requête échoue
 */
export const getTeamTasks = async (
  teamId: string,
  params: SearchTasksFilter
) => {
  try {
    const axiosResponse = await axiosClient.get(`/teams/${teamId}/tasks`, {
      params,
    });
    return axiosResponse.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur lors de la récupération des tâches de l'équipe");
  }
};

/**
 * Récupère les projets d'une équipe
 * En cas d'erreur, lance une exception avec un message d'erreur
 *
 * @param {string} teamId - identifiant du projet
 * @param {SearchProjectsFilter} params - paramètres de recherche des projets
 * @returns la liste des projets d'une équipe repondant aux critères de recherche
 * @throws - Une erreur si la requête échoue
 */
export const getTeamProjects = async (
  teamId: string,
  params: SearchProjectsFilter
) => {
  try {
    const axiosResponse = await axiosClient.get(`/teams/${teamId}/projects`, {
      params,
    });
    return axiosResponse.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur lors de la récupération des projets de l'équipe");
  }
};

/**
 * Ajoute un mmebre dans une équipe
 * En cas d'erreur, lance une exception avec un message d'erreur
 *
 * @param {string} teamId - identifiant de l'équipe
 * @param {string} memberId - identifiant du membre
 * @param {string} memberRole - rôle du membre dans l'équipe
 * @throws - Une erreur si la requête échoue
 */
export const addMemberToTeam = async (
  teamId: string,
  memberId: string,
  memberRole: string
) => {
  try {
    const axiosResponse = await axiosClient.post(`/teams/${teamId}/members`, {
      userId: memberId,
      userRole: memberRole,
    });
    return axiosResponse.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur lors de l'ajout du membre dans l'équipe");
  }
};

/**
 * Modifie le rôle d'un mmebre dans une équipe
 * En cas d'erreur, lance une exception avec un message d'erreur
 *
 * @param {string} teamId - identifiant de l'équipe
 * @param {string} memberId - identifiant du membre
 * @param {string} memberRole - nouveau rôle du membre dans l'équipe
 * @throws - Une erreur si la requête échoue
 */
export const updateTeamMemberRole = async (
  teamId: string,
  memberId: string,
  memberRole: string
) => {
  try {
    const axiosResponse = await axiosClient.patch(
      `/teams/${teamId}/members/${memberId}`,
      {
        userRole: memberRole,
      }
    );
    return axiosResponse.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error(
      "Erreur lors de la mise à jour du role de l'utilisateur dans l'équipe"
    );
  }
};

/**
 * Retire un mmebre d' une équipe
 * En cas d'erreur, lance une exception avec un message d'erreur
 *
 * @param {string} teamId - identifiant de l'équipe
 * @param {string} memberId - identifiant du membre
 * @throws - Une erreur si la requête échoue
 */
export const removeMemberFromTeam = async (
  teamId: string,
  memberId: string
) => {
  try {
    const axiosResponse = await axiosClient.delete(
      `/teams/${teamId}/members/${memberId}`
    );
    return axiosResponse.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur lors du retrait du membre de l'équipe");
  }
};
