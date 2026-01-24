import axios from "axios";

/**
 * Clent axios pour faire des requêtes à l'API
 */
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL||"http://localhost:3000",
  withCredentials: true,

});
