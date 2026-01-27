import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {userStore} from "@/stores/userStore";
import {axiosClient} from "@/lib/axios/axiosClient";

/**
 * Page d'échange code <=> token avec le backend
 */
export default function AuthCallback(){
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const {setToken} = userStore();
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

                if (!token) {
                    navigate("/login");
                    return;
                }
                setToken(token);
                navigate("/dashboard");
            } catch (error) {
                console.error("Code exchange failed", error);
                navigate("/login");
            }
        };
        exchangeCode();
    }, []);

    return <div>Login...</div>
}