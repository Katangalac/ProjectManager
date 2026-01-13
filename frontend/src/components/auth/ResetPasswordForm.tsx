import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { InputPassword } from "../ui/InputPassword.tsx";
import { axiosClient } from "@/lib/axios/axiosClient.ts";
import { resetPasswordSchema } from "../../schemas/auth.schemas.ts";
import { showError, showSuccess } from "@/utils/toastService.ts";

type ResetPassordFormProps = {
  onSuccess: () => void;
  token: string;
};

/**
 * Formulaire de reset d'un mot de passe
 */
export default function ResetPasswordForm({
  onSuccess,
  token,
}: ResetPassordFormProps) {
  /**
   * Configuration de react-hook-form avec validation Zod
   */
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<{ newPassword: string; confirmPassword: string }>({
    resolver: zodResolver(resetPasswordSchema),
  });

  //   const token = new URLSearchParams(window.location.search).get("token");

  const onSubmit = async (data: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      if (data.newPassword === data.confirmPassword) {
        await axiosClient.post("/auth/reset-password", {
          token: token,
          newPassword: data.newPassword,
        });
        showSuccess("Your password has been reset successfully!");
        onSuccess();
      } else {
        setError("confirmPassword", {
          type: "value",
          message: "Your confirmation password is not correct",
        });
      }
    } catch (err) {
      console.error(err);
      showError("Something went wrong!");
    }
  };

  return (
    <div
      className={clsx(
        "mx-auto w-full max-w-md p-8",
        "bg-white",
        "dark:bg-gray-900"
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={clsx("space-y-5")}>
        <div>
          <InputPassword
            placeholder="New password"
            iconPosition="right"
            error={errors.newPassword?.message}
            {...register("newPassword")}
            className="border-gray-400"
          />
        </div>

        <div>
          <InputPassword
            placeholder="Confirm password"
            iconPosition="right"
            error={errors.newPassword?.message}
            {...register("confirmPassword")}
            className="border-gray-400"
          />
        </div>

        <button
          type="submit"
          className={clsx(
            "w-full py-2 font-semibold text-white",
            "rounded-sm bg-sky-500 hover:bg-sky-600"
          )}
        >
          Confirm
        </button>
      </form>
    </div>
  );
}
