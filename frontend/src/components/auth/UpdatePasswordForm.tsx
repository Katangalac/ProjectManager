import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePasswordSchema } from "../../schemas/auth.schemas.ts";
import { UpdatePasswordData } from "../../types/Auth.ts";
import { updatePassword } from "../../api/auth.api.ts";
import { clsx } from "clsx";
import { InputPassword } from "../ui/InputPassword.tsx";
import { AppError } from "@/errors/AppError.ts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog.tsx";
import ForgotPasswordForm from "./ForgetPasswordForm.tsx";
import { useState } from "react";

type UpdatePassordFormProps = {
  onSuccess: () => void;
};

/**
 * Formulaire de connexion
 * Permet à l'utilisateur de se connecter oafin d'accéder au dashboard
 */
export default function UpdatePasswordForm({
  onSuccess,
}: UpdatePassordFormProps) {
  const [showDialog, setShowDialog] = useState(false);

  /**
   * Configuration de react-hook-form avec validation Zod
   */
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UpdatePasswordData>({
    resolver: zodResolver(updatePasswordSchema),
  });

  /**
   * Fonction appelée lors de la soumission du formulaire de connexion
   * Met à jour l'état de l'utilisateur et redirige vers le dashboard
   *
   * @param {UpdatePasswordData} data - données du formulaire de connexion
   */
  const onSubmit = async (data: UpdatePasswordData) => {
    try {
      await updatePassword(data);
      onSuccess();
    } catch (err) {
      console.error(err);
      if (err instanceof AppError) {
        switch (err.code) {
          case "INVALID_PASSWORD":
            setError("currentPassword", {
              type: "server",
              message: err.message,
            });
            break;
          default:
            setError("root", {
              type: "server",
              message: err.message,
            });
        }
      }
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
      <p
        className={clsx(
          "mb-6 text-center text-sm font-medium text-gray-500",
          "dark:text-gray-400"
        )}
      >
        Enter your current and new password
      </p>
      {errors.root && (
        <p className={clsx("text-left text-xs text-red-600")}>
          {errors.root.message}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={clsx("space-y-5")}>
        <div>
          <InputPassword
            placeholder="Current password"
            iconPosition="right"
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
            className="border-gray-400"
          />

          <p className={clsx("mt-2 text-right text-sm")}>
            <span
              className={clsx(
                "cursor-pointer font-medium text-sky-600 hover:underline"
              )}
              onClick={() => setShowDialog(true)}
            >
              Forget password?
            </span>
          </p>
        </div>

        <div>
          <InputPassword
            placeholder="New password"
            iconPosition="right"
            error={errors.newPassword?.message}
            {...register("newPassword")}
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
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className={clsx(
            "max-w-[500px] p-0",
            "[&>button]:text-white",
            "[&>button]:hover:text-white"
          )}
        >
          <DialogHeader className={clsx("rounded-t-md bg-sky-500 px-4 py-4")}>
            <DialogTitle className="text-lg text-white">
              Forget password
            </DialogTitle>
          </DialogHeader>
          <div
            className={clsx(
              "max-h-[80vh] overflow-y-auto rounded-b-md py-4 pl-4",
              "[&::-webkit-scrollbar]:w-0",
              "[&::-webkit-scrollbar-track]:rounded-md",
              "[&::-webkit-scrollbar-thumb]:rounded-md"
            )}
          >
            <ForgotPasswordForm onSuccess={() => setShowDialog(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
