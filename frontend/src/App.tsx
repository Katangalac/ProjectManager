import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootRedirect from "./pages/RootRedirect.tsx";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashBoard from "./pages/DashBoard.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import ProtectedRoute from "./components/commons/ProtectedRoute.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import { useUserStore } from "./stores/userStore.ts";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "./services/auth.services.ts";

/**
 * Point d'entrée de l'application
 */
function App() {
  const { setUser, logout, isAuthenticated } = useUserStore();

  /**
   * Récupère les informations de l'utilisateur connecté
   */
  const { data, isError, isSuccess } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!isAuthenticated,
    retry: false,
  });

  /**
   * Met à jour le store avec les informations de l'utilisateur connecté
   * S'assure de déconnecter l'utilisateur en cas d'erreur de la requête avec useQuery
   */
  useEffect(() => {
    if (isSuccess && data) {
      setUser(data.data);
    }

    if (isError) {
      logout();
    }
  }, [isSuccess, isError, data, logout, setUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id?"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
