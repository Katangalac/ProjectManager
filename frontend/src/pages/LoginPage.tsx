import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

/**
 * Page de connexion
 */
export default function LoginPage() {
    return (
        <AuthLayout>
            <LoginForm/>
        </AuthLayout>
    );
};