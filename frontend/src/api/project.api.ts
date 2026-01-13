import { axiosClient } from "../lib/axios/axiosClient";
import axios from "axios";
import { SearchProjectsFilter } from "../types/Project";
import { SearchTasksFilter } from "@/types/Task";
import { SearchUsersFilter } from "@/types/User";
import { SearchTeamsFilter } from "@/types/Team";
import { CreateProjectData, UpdateProjectData } from "../types/Project";

/**
 * Crée un nouveau projet
 *
 * @param {CreateProjectData} data : données du projet à créer
 * @returns le projet créé
 */
export const createProject = async (data: CreateProjectData) => {
  try {
    const axiosResponse = await axiosClient.post("/projects", data);
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur lors de la création du projet");
  }
};

/**
 * Met à jour un projet
 * En cas d'erreur, lance une exception avec un message d'erreur
 *
 * @param {string} projectId : identifiant du projet à récupérer
 * @param {UpdateProjectData} data : nouvelles données du projet
 * @returns le projet modifié
 * @throws - Une erreur si la requête échoue
 */
export const updateProject = async (
  projectId: string,
  data: UpdateProjectData
) => {
  try {
    const axiosResponse = await axiosClient.patch(
      `/projects/${projectId}`,
      data
    );
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur lors de la mise à jour du projet");
  }
};

/**
 * Récupère le projet ayant l'identifiant passé en paramètre
 * En cas d'erreur, lance une exception avec un message d'erreur
 *
 * @param {string} projectId : identifiant du projet à récupérer
 * @returns le projet ayant l'identifiant passé en paramètre
 * @throws - Une erreur si la requête échoue
 */
export const getProjectById = async (projectId: string) => {
  try {
    const axiosResponse = await axiosClient.get(`/projects/${projectId}`);
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur lors de la mise à jour du projet");
  }
};

/**
 * Calcul le cout total d'un projet
 * En cas d'erreur, lance une exception avec un message d'erreur
 *
 * @param {string} projectId : identifiant du projet
 * @returns le cout total du projet ayant l'identifiant passé en paramètre
 * @throws - Une erreur si la requête échoue
 */
export const getProjectTotalCost = async (projectId: string) => {
  try {
    const axiosResponse = await axiosClient.get(
      `/projects/${projectId}/totalCost`
    );
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur lors du calcul du cout total du projet");
  }
};

/**
 * Récupère les projets de l'utilisateur courant correspondant aux paramètres de recherche
 * En cas d'erreur, lance une exception avec un message d'erreur
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
    return axiosResponse.data;
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

/**
 * Récupère les tâches d'un projet
 * En cas d'erreur, lance une exception avec un message d'erreur
 *
 * @param {string} projectId - identifiant du projet
 * @param {SearchTasksFilter} params - paramètres de recherche des tâches
 * @returns la liste des taches du projet repondant aux critères de recherche
 * @throws - Une erreur si la requête échoue
 */
export const getProjectTasks = async (
  projectId: string,
  params: SearchTasksFilter
) => {
  try {
    const axiosResponse = await axiosClient.get(
      `/projects/${projectId}/tasks`,
      {
        params,
      }
    );
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur lors de l arécupération des tâches du projet");
  }
};

/**
 * Récupère les équipes d'un projet
 * En cas d'erreur, lance une exception avec un message d'erreur
 *
 * @param {string} projectId - identifiant du projet
 * @param {SearchTeamsFilter} params - paramètres de recherche des équipes
 * @returns la liste des équipes du projet repondant aux critères de recherche
 * @throws - Une erreur si la requête échoue
 */
export const getProjectTeams = async (
  projectId: string,
  params: SearchTeamsFilter
) => {
  try {
    const axiosResponse = await axiosClient.get(
      `/projects/${projectId}/teams`,
      {
        params,
      }
    );
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur lors de la récupération des équipes du projet");
  }
};

/**
 * Récupère les collaborateurs d'un projet
 * En cas d'erreur, lance une exception avec un message d'erreur
 *
 * @param {string} projectId - identifiant du projet
 * @param {SearchUsersFilter} params - paramètres de recherche des utilisateurs
 * @returns la liste des collaborateurs du projet repondant aux critères de recherche
 * @throws - Une erreur si la requête échoue
 */
export const getProjectCollaborators = async (
  projectId: string,
  params: SearchUsersFilter
) => {
  try {
    const axiosResponse = await axiosClient.get(
      `/projects/${projectId}/collaborators`,
      {
        params,
      }
    );
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error(
      "Erreur lors de la récupération des collaborateurs du projet"
    );
  }
};

/**
 * Supprime le projet ayant l'identifiant passé en paramètre
 * En cas d'erreur, lance une exception avec un message d'erreur
 *
 * @param {string} projectId - identifiant du projet
 * @throws - Une erreur si la requête échoue
 */
export const deleteProject = async (projectId: string) => {
  try {
    const axiosResponse = await axiosClient.delete(`/projects/${projectId}`);
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur lors de la suppression du projet");
  }
};

/**
 * Ajoute une équipe dans un projet
 *
 * @param {string} projectId - identifiant du projet
 * @param {string} teamId - identifiant de l'équipe
 * @returns - un objet représentant la lisaison entre le projet et l'équipe : {projectId,teamId}
 * @throws - Une erreur si la requête échoue
 */
export const addTeamToProject = async (projectId: string, teamId: string) => {
  try {
    const axiosResponse = await axiosClient.post(
      `/projects/${projectId}/teams/${teamId}`
    );
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur lors de l'ajout de l'équipe dans le projet");
  }
};

/**
 * Retire une équipe d'un projet
 *
 * @param {string} projectId - identifiant du projet
 * @param {string} teamId - identifiant de l'équipe
 * @throws - Une erreur si la requête échoue
 */
export const removeTeamFromProject = async (
  projectId: string,
  teamId: string
) => {
  try {
    const axiosResponse = await axiosClient.delete(
      `/projects/${projectId}/teams/${teamId}`
    );
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur lors du retrait de l'équipe dans le projet");
  }
};
