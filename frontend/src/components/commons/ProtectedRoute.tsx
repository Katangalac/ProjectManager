import { Navigate } from "react-router-dom";
import { JSX } from "react";
import { useUserStore } from "../stores/userStore";

/**
 * Composant qui vérifie que l'utilisateur est connecté avant de
 * le laisser accèder à une page.
 * Protège les page nécessitant une authentification
 * @param children - la page qu'on souhaite protégée à laquelle l'utilisateur
 *                   veut accéder
 * @returns - la page à laquelle l'utilisateur souhaite accéder si connecté,
 *            sinon redirige vers la page de connexion
 */
export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { isAuthenticated } = useUserStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
