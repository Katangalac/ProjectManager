import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";
import MotionPage from "@/components/commons/MotionPage";

/**
 * Page de connexion
 */
export default function LoginPage() {
  return (
    <MotionPage>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </MotionPage>
  );
}
