import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePasswordSchema } from "../../schemas/auth.schemas.ts";
import { UpdatePasswordData } from "../../types/Auth.ts";
import { updatePassword } from "../../api/auth.api.ts";
import { clsx } from "clsx";
import { InputPassword } from "../ui/InputPassword.tsx";
import { AppError } from "@/errors/AppError.ts";

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
  //const backendUrl = import.meta.env.VITE_API_URL;

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
            <a
              className={clsx("font-medium text-sky-600 hover:underline")}
              href="/"
            >
              Forget password?
            </a>
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
    </div>
  );
}
