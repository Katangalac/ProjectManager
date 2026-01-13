import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

/**
 * Page racine de l'application
 * Rédirige soit vers le dashbord soit vers la page de connexion selon
 * que l'utilisateur est connecté ou non
 */
export default function RootRedirect() {
  const { isAuthenticated } = useUserStore();

  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}
