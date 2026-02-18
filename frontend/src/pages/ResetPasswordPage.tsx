import { useEffect, useState } from "react";
import { axiosClient } from "@/lib/axios/axiosClient";
import { useNavigate } from "react-router-dom";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import MotionPage from "@/components/commons/MotionPage";

/**Page de reset du mot de passe */
export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  const token = new URLSearchParams(window.location.search).get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setValid(false);
      setLoading(false);
      return;
    }

    axiosClient
      .post("/auth/validate-reset-token", { token })
      .then(() => {
        setValid(true);
      })
      .catch(() => {
        setValid(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <p>Validating link...</p>;
  }

  if (!valid) {
    return <p>Invalid link!</p>;
  }

  return (
    <MotionPage>
      {token ? (
        <ResetPasswordForm token={token} onSuccess={() => navigate("/login")} />
      ) : (
        <p>Invalid link!</p>
      )}
    </MotionPage>
  );
}
