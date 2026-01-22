import { axiosClient } from "@/lib/axios/axiosClient";
import axios from "axios";
import {
  CreateTaskData,
  UpdateTaskData,
  SearchTasksFilter,
} from "../types/Task";

/**
 * Crée une nouvelle tâche
 *
 * @param {CreateTaskData} taskData - données de la tâche
 * @returns la tâche créée
 * @throws - Une erreur si la requête échoue
 */
export const createTask = async (taskData: CreateTaskData) => {
  try {
    const axiosResponse = await axiosClient.post("/tasks", taskData);
    console.log("TASKS:", axiosResponse);
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message = error.response?.data?.message;
      console.log("TASKS-ERR", message);
      throw new Error(message);
    }
    throw new Error("Erreur inconnue lors de la création de la tâche");
  }
};

/**
 * Récupère les tâches de l'utilisateur courant correspondant aux paramètres de recherche
 * En cas d'erreur, lance une exception avec le message d'erreur
 *
 * @param {SearchTasksFilter} params - les paramètres de la requête
 * @returns - La liste des tâches de l'utilisateur courant
 * @throws - Une erreur si la requête échoue
 */
export const getCurrentUserTasks = async (params: SearchTasksFilter) => {
  try {
    const axiosResponse = await axiosClient.get("/users/me/tasks", {
      params,
    });
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
 * Récupère la tache ayant l'identifiant passé en paramètre
 * En cas d'erreur, lance une exception avec le message d'erreur
 *
 * @param {string} id - identifiant de la tache à trouver
 * @returns - La tache ayant l'identifiant passé en paramètre
 * @throws - Une erreur si la requête échoue
 */
export const getTaskById = async (id: string) => {
  try {
    const axiosResponse = await axiosClient.get(`/tasks/${id}`);
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur lors de la récupération de la tache");
  }
};

/**
 * Met à jour une tâche
 *
 * @param {string} taskId - identifiant de la tâche
 * @param {UpdateTaskData} taskData - nouvelles données de la tâche
 * @returns la tâche mise à jour
 * @throws - Une erreur si la requête échoue
 */
export const updateTask = async (taskId: string, taskData: UpdateTaskData) => {
  try {
    const axiosResponse = await axiosClient.patch(`/tasks/${taskId}`, taskData);
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur inconnue lors de la mise à jour de la tâche");
  }
};

/**
 * Suppprime une tâche
 *
 * @param {string} taskId - identifiant de la tâche
 * @throws - Une erreur si la requête échoue
 * @throws - Une erreur si la requête échoue
 */
export const deleteTask = async (taskId: string) => {
  try {
    const axiosResponse = await axiosClient.delete(`/tasks/${taskId}`);
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur inconnue lors de la suppression de la tâche");
  }
};

/**
 * Assigne une tâche à un utilisateur
 *
 * @param {string} taskId - identifiant de la tâche
 * @param {string} userId - identifiant de l'utilisateur à qui on veut assigner la tâche
 * @throws - Une erreur si la requête échoue
 */
export const assignTask = async (taskId: string, userId: string) => {
  try {
    const axiosResponse = await axiosClient.post(
      `/tasks/${taskId}/contributors/${userId}`
    );
    return axiosResponse.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur inconnue lors de l'assignation de la tâche");
  }
};

/**
 * Desassigne une tâche à un utilisateur
 *
 * @param {string} taskId - identifiant de la tâche
 * @param {string} userId - identifiant de l'utilisateur de qui on veut desassigner la tâche
 * @throws - Une erreur si la requête échoue
 *
 */
export const unassignTask = async (taskId: string, userId: string) => {
  try {
    const axiosResponse = await axiosClient.delete(
      `/tasks/${taskId}/contributors/${userId}`
    );
    return axiosResponse.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error("Erreur inconnue lors de la desassignation de la tâche");
  }
};
