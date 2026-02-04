import axios from "axios";
import { userStore } from "@/stores/userStore";

/**
 * Clent axios pour faire des requêtes à l'API
 */
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

// Log pour debug (retirer en prod)
axiosClient.interceptors.request.use((config) => {
  const token = userStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status);
    return response;
  },
  (error) => {
    console.error("❌ Error:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);
