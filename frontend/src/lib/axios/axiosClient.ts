import axios from "axios";
import {getUserStore} from "@/stores/getUserStore";

/**
 * Clent axios pour faire des requêtes à l'API
 */
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL||"http://localhost:3000",
  withCredentials: true,
});

// Log pour debug (retirer en prod)
axiosClient.interceptors.request.use((config) => {
    console.log("AXIOS-INTERCEPT-1")
    const token = getUserStore().getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("AXIOS-INTERCEPT-2")
  console.log('🔹 Request:', config.method?.toUpperCase(), config.url);
  console.log('🔹 Request-Auth:', token);
  console.log('🍪 With credentials:', config.withCredentials);
  return config;
});

axiosClient.interceptors.response.use(
    (response) => {
      console.log('✅ Response:', response.status);
      return response;
    },
    (error) => {
      console.error('❌ Error:', error.response?.status, error.message);
      return Promise.reject(error);
    }
);