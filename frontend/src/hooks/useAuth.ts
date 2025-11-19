import { useEffect, useState } from "react";
import { axiosClient } from "../lib/axiosClient";

type UseAuthReturn = {
  isAuthenticated: boolean;
  loading: boolean;
};

/**
 * Vérifie si l'utilisateur est authentifié
 * @returns - l'état de connexion de l'utilisateur
 */
export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/auth/verify")
      .then((res) => {
        setIsAuthenticated(res.data.authenticated);
        setLoading(false);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setLoading(false);
      });
  }, []);

  return { isAuthenticated, loading };
}
