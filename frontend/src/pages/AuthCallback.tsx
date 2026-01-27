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
    useEffect(()=>{
        const code = params.get("code");
        if(!code)return navigate("/login");
        axiosClient.post("/exchange", {code}).then((res)=>{
            const token = res.data.data.token;
            if(token){
                setToken(token);
            }
            navigate("/dashboard");
        }))
    }, [])
    return <div>Login...</div>
}