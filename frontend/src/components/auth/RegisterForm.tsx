import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../schemas/auth.schemas.ts";
import { RegisterInputs } from "../../types/Auth.ts";
import { registerRequest } from "../../api/auth.api.ts";
import { useNavigate } from "react-router-dom";
import { Google } from "@lobehub/icons";
import { clsx } from "clsx";
import { userStore } from "../../stores/userStore.ts";
import { InputText } from "../ui/InputText.tsx";
import { InputPassword } from "../ui/InputPassword.tsx";
import { User, Mail } from "lucide-react";
import { toast } from "sonner";
import { toastStyle } from "@/utils/toastStyle.ts";
import { AppError } from "@/errors/AppError.ts";

/**
 * Formulaire d'inscription
 * Permet à l'utilisateur de s'inscrire afin d'accéder au dashboard
 */
export default function RegisterForm() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_API_URL;
  const setUser = userStore((state) => state.setUser);
  const setToken = userStore((state) => state.setToken);

  /**
   * Configuration de react-hook-form avec validation Zod
   */
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
  });

  /**
   * Fonction appelée lors de la soumission du formulaire d'inscription
   * Met à jour l'état de l'utilisateur et redirige vers le dashboard
   *
   * @param {RegisterInputs} data - données du formulaire d'inscription
   */
  const onSubmit = async (data: RegisterInputs) => {
    try {
      const result = await registerRequest(
        data.userName,
        data.email,
        data.password
      );
      setToken(result.data.token);
      setUser(result.data.user);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);

      if (err instanceof AppError) {
        switch (err.code) {
          case "EMAIL_CONFLICT":
            setError("email", {
              type: "server",
              message: err.message,
            });
            break;
          case "USERNAME_CONFLICT":
            setError("userName", {
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
        Create an account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className={clsx("space-y-5")}>
        {errors.root && <p className="text-red-500">{errors.root.message}</p>}
        <div>
          <InputText
            icon={<User className="size-6 stroke-[1.25px]" />}
            placeholder="Username"
            iconPosition="right"
            error={errors.userName?.message}
            {...register("userName")}
            className="border-gray-400"
          />
        </div>

        <div>
          <InputText
            icon={<Mail className="size-6 stroke-[1.25px]" />}
            placeholder="Email"
            iconPosition="right"
            error={errors.email?.message}
            {...register("email")}
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
        </div>

        <button
          type="submit"
          className={clsx(
            "w-full py-2 font-semibold text-white",
            "rounded-sm bg-sky-500 hover:bg-sky-600"
          )}
        >
          Sign up
        </button>
      </form>

      <div className={clsx("relative my-6 flex items-center")}>
        <div className={clsx("grow border-t border-gray-300")}></div>
        <span
          className={clsx(
            "mx-4 text-sm font-medium whitespace-nowrap text-gray-500"
          )}
        >
          Or sign up with
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
          Already have an account ?{" "}
        </span>
        <a
          className={clsx("font-medium text-sky-600 hover:underline")}
          href="/"
        >
          Login
        </a>
      </p>
    </div>
  );
}
