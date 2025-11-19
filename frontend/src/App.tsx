// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootRedirect from "./pages/RootRedirect.tsx";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashBoard from "./pages/DashBoard.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { useUserStore } from "./stores/userStore.ts";
import { useEffect } from "react";
import { getMe } from "./services/auth/auth.services.ts";
//import { useAuth } from "./hooks/useAuth.ts";

function App() {
  const { setUser, logout } = useUserStore();

  useEffect(() => {
    getMe()
      .then((res) => setUser(res.data))
      .catch(() => logout());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
