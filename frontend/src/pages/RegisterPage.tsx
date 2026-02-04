import MotionPage from "@/components/commons/MotionPage";
import AuthLayout from "../components/auth/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";

/**
 * Page d'inscription
 */
export default function RegisterPage() {
  return (
    <MotionPage>
      <AuthLayout>
        <RegisterForm />
      </AuthLayout>
    </MotionPage>
  );
}
