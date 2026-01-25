import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schemas/auth.schemas.ts";
import { LoginInputs } from "../../types/Auth.ts";
import { loginRequest } from "../../api/auth.api.ts";
import { useNavigate } from "react-router-dom";
import { Google } from "@lobehub/icons";
import { clsx } from "clsx";
import { userStore } from "../../stores/userStore.ts";
import { InputText } from "../ui/InputText.tsx";
import { InputPassword } from "../ui/InputPassword.tsx";
import { toast } from "sonner";
import { toastStyle } from "@/utils/toastStyle.ts";
import { User } from "lucide-react";
import { AppError } from "@/errors/AppError.ts";
import { useState } from "react";
import ForgotPasswordForm from "./ForgetPasswordForm.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog.tsx";
import { RotateCcwKeyIcon } from "lucide-react";

/**
 * Formulaire de connexion
 * Permet à l'utilisateur de se connecter oafin d'accéder au dashboard
 */
export default function LoginForm() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_API_URL;
  const setUser = userStore((state) => state.setUser);
  const setToken = userStore((state) => state.setToken);
  const [showDialog, setShowDialog] = useState(false);
  /**
   * Configuration de react-hook-form avec validation Zod
   */
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  /**
   * Fonction appelée lors de la soumission du formulaire de connexion
   * Met à jour l'état de l'utilisateur et redirige vers le dashboard
   *
   * @param {LoginInputs} data - données du formulaire de connexion
   */
  const onSubmit = async (data: LoginInputs) => {
    try {
      const result = await loginRequest(data.identifier, data.password);
      setToken(result.data.token)
      setUser(result.data.user);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      if (err instanceof AppError) {
        switch (err.code) {
          case "INVALID_PASSWORD":
            setError("root", {
              type: "server",
              message: "Invalid credentials",
            });
            break;
          case "USER_NOT_FOUND":
            setError("root", {
              type: "server",
              message: "Invalid credentials",
            });
            break;
          default:
            setError("root", {
              type: "server",
              message: err.message,
            });
        }
      }
      toast.error("Oops, something went wrong while processing your request.", {
        style: toastStyle["soft-error"],
        position: "top-center",
      });
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
      <h2
        className={clsx(
          "mb-4 text-center text-3xl font-bold text-black",
          "dark:text-white"
        )}
      >
        Welcome back!
      </h2>
      <p
        className={clsx(
          "mb-6 text-center text-sm font-medium text-gray-500",
          "dark:text-gray-400"
        )}
      >
        Enter your identifiers to get access to your account
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className={clsx("space-y-5")}>
        {errors.root && <p className="text-red-500">{errors.root.message}</p>}
        <div>
          <InputText
            icon={<User className="size-6 stroke-[1.25px]" />}
            placeholder="Username or Email"
            iconPosition="right"
            error={errors.identifier?.message}
            {...register("identifier")}
            className="border-gray-400"
          />
        </div>

        <div>
          <InputPassword
            placeholder="Password"
            iconPosition="right"
            error={errors.password?.message}
            {...register("password")}
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

        <button
          type="submit"
          className={clsx(
            "w-full py-2 font-semibold text-white",
            "rounded-sm bg-sky-500 hover:bg-sky-600"
          )}
        >
          Login
        </button>
      </form>

      <div className={clsx("relative my-6 flex items-center")}>
        <div className={clsx("grow border-t border-gray-300")}></div>
        <span
          className={clsx(
            "mx-4 text-sm font-medium whitespace-nowrap text-gray-500"
          )}
        >
          Or login with
        </span>
        <div className={clsx("grow border-t border-gray-300")}></div>
      </div>

      <div className={clsx("flex items-center justify-between gap-2")}>
        <a className={clsx("w-full")} href={`${backendUrl}/auth/google`}>
          <button
            className={clsx(
              "flex w-full items-center justify-center gap-2 px-2 py-2",
              "rounded-sm border border-gray-300 bg-gray-50 hover:bg-gray-200",
              "font-medium text-gray-600"
            )}
          >
            <Google.Color size={16} /> Google
          </button>
        </a>
      </div>

      <p className={clsx("mt-6 text-center text-sm")}>
        <span
          className={clsx("font-medium text-gray-500", "dark:text-gray-400")}
        >
          Don't have an account ?{" "}
        </span>
        <span
          className={clsx("font-medium text-sky-600 hover:underline")}
          onClick={() => navigate("/register")}
        >
          Sign up
        </span>
      </p>
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
              <span className="flex h-fit items-center gap-2">
                <RotateCcwKeyIcon className="size-6 stroke-[2.5px]" /> Forget
                password
              </span>
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
