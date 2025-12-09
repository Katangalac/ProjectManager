import { axiosClient } from "../lib/axios/axiosClient";
import axios from "axios";
import {
  CreateTaskData,
  UpdateTaskData,
  SearchTasksFilter,
} from "../types/Task";

export const createTask = async (taskData: CreateTaskData) => {
  try {
    const axiosResponse = await axiosClient.post("/tasks", taskData);
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message = error.response?.data?.message;
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
 * Récupère les tâches d'un projet donné
 * En cas d'erreur, lance une exception avec le message d'erreur
 *
 * @param {string} projectId - L'ID du projet
 * @returns - La liste des tâches du projet
 * @throws - Une erreur si la requête échoue
 */
export const getProjectTasks = async (projectId: string) => {
  try {
    const axiosResponse = await axiosClient.get(`/projects/${projectId}/tasks`);
    return axiosResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError?.(error)) {
      const message = error.response?.data?.message;
      throw new Error(message);
    }
    throw new Error(
      "Erreur inconnue lors de la récupération des tâches du projet"
    );
  }
};

/**
 *
 * @param taskId
 * @param taskData
 * @returns
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
 *
 * @param taskId
 * @returns
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
