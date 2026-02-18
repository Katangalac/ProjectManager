import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getMe } from "@/api/auth.api";
import { userStore } from "@/stores/userStore";
import { axiosClient } from "@/lib/axios/axiosClient";
import { socket } from "@/lib/socket/socketClient";

/**
 * Page d'échange code <=> token avec le backend
 */
export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, setUser } = userStore();
  useEffect(() => {
    const code = params.get("code");

    if (!code) {
      navigate("/login");
      return;
    }
    const exchangeCode = async () => {
      try {
        const res = await axiosClient.post("/auth/exchange", { code });
        const token = res.data?.data?.token;
        console.log(token);
        if (!token) {
          navigate("/login");
          return;
        }
        setToken(token);
        const axiosResData = await getMe();
        setUser(axiosResData.data);
        try {
          console.log("Connecté");
          socket.connect();
        } catch (error: unknown) {
          console.log("Erreur de socket!", error);
        }
        navigate("/dashboard");
      } catch (error) {
        console.error("Code exchange failed", error);
        navigate("/login");
      }
    };
    exchangeCode();
  }, []);

  return <div>Login...</div>;
}
