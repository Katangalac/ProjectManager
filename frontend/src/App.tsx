import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootRedirect from "./pages/RootRedirect.tsx";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashBoard from "./pages/DashBoard.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import ProtectedRoute from "./components/commons/ProtectedRoute.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import UserTasksPage from "./pages/UserTasksPage.tsx";
import CalendarPage from "./pages/CalendarPage.tsx";
import ProjectPage from "./pages/ProjectsPage.tsx";
import UserTeamsPage from "./pages/UserTeamsPage.tsx";
import TeamDetailsPage from "./pages/TeamDetailsPage.tsx";
import { useUserStore } from "./stores/userStore.ts";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "./services/auth.services.ts";
import { ConfirmDialog } from "primereact/confirmdialog";
import { clsx } from "clsx";

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
    <>
      <ConfirmDialog
        className={clsx(
          "min-w-fit gap-5 rounded-lg border border-gray-300 bg-white p-5 text-sm",
          "dark:border-gray-600 dark:bg-gray-900",
          "text-gray-700 dark:text-gray-300",
          "myDialog"
        )}
      />
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
              path="/userTasks"
              element={
                <ProtectedRoute>
                  <UserTasksPage />
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
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <CalendarPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/userProjects"
              element={
                <ProtectedRoute>
                  <ProjectPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/userTeams"
              element={
                <ProtectedRoute>
                  <UserTeamsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/userTeams/:teamId"
              element={
                <ProtectedRoute>
                  <TeamDetailsPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
