import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootRedirect from "./pages/RootRedirect.tsx";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthCallback from "./pages/AuthCallback";
import DashBoard from "./pages/DashBoard.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import ProtectedRoute from "./components/commons/ProtectedRoute.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import UserTasksPage from "./pages/UserTasksPage.tsx";
import CalendarPage from "./pages/CalendarPage.tsx";
import ProjectsPage from "./pages/ProjectsPage.tsx";
import ProjectDetailsPage from "./pages/ProjectDetailsPage.tsx";
import UserTeamsPage from "./pages/UserTeamsPage.tsx";
import TeamDetailsPage from "./pages/TeamDetailsPage.tsx";
import NotificationsPage from "./pages/NotficationPage.tsx";
import TestPage from "./pages/TestPage.tsx";
import MessagePage from "./pages/MessagePage.tsx";
import { userStore } from "./stores/userStore.ts";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "./api/auth.api.ts";
import { ConfirmDialog } from "primereact/confirmdialog";
import { clsx } from "clsx";
import { Toaster } from "@/components/ui/sonner";
import { useSocket } from "./hooks/socket/useSocket.ts";
import { toast } from "sonner";
import { MessageWithRelation } from "./types/Message.ts";
import { Notification } from "./types/Notification.ts";
import { socket } from "./lib/socket/socketClient.ts";
import {showInfo} from "@/utils/toastService";

/**
 * Point d'entrée de l'application
 */
function App() {
  const { setUser, logout, isAuthenticated, user } = userStore();

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

  //Evénements socket global
  useSocket<MessageWithRelation>("new_message", (data) => {
    if (user && data.senderId !== user.id) {
        if(data.content) showInfo(data.content);
    }
  });

  useSocket<Notification>("new_notification", (data) =>
    showInfo(data.message)
  );

  useSocket<string>("new_conversation", (data) =>
    socket.emit("join_conversation", data)
  );

  useSocket<string>("new_team", (data) => socket.emit("join_team", data));

  useSocket<string>("leave_team", (data) => socket.emit("remove_team", data));
  //Fin d'evenements socket

  return (
    <>
      <ConfirmDialog
        className={clsx(
          "min-w-fit gap-5 rounded-lg border border-gray-300 bg-white text-sm",
          "dark:border-gray-600 dark:bg-gray-900",
          "text-gray-700 dark:text-gray-300",
          "myDialog"
        )}
      />
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallback/>}/>
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
                  <ProjectsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/userProjects/:projectId"
              element={
                <ProtectedRoute>
                  <ProjectDetailsPage />
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
            <Route
              path="/test"
              element={
                <ProtectedRoute>
                  <TestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <MessagePage />
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
