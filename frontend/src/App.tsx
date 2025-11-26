// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootRedirect from "./pages/RootRedirect.tsx";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashBoard from "./pages/DashBoard.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import MainLayout from "./components/MainLayout.tsx";
import { useUserStore } from "./stores/userStore.ts";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "./services/auth.services.ts";

function App() {
  const {
    setUser,
    logout,
    isAuthenticated,
    user: currentUser,
  } = useUserStore();

  const { data, isError, isSuccess } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess && data) {
      const remote = data.data;
      const changed =
        !currentUser ||
        remote.id !== currentUser?.id ||
        JSON.stringify(remote) !== JSON.stringify(currentUser);
      if (changed) setUser(data.data);
    }

    if (isError) {
      logout();
    }
  }, [isSuccess, isError, data, logout, setUser, currentUser]);

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
