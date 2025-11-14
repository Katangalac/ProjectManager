import AuthForm from "../components/auth/AuthForm";
import AuthLayout from "../components/auth/AuthLayout";

export default function LoginPage() {
    return (
        <AuthLayout>
            <AuthForm type="LOGIN"></AuthForm>
        </AuthLayout>
    );
};