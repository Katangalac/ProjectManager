import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../schemas/auth.schemas.ts";
import { RegisterInputs } from "../../types/Auth.ts";
import { registerRequest } from "../../services/auth.services.ts";
import { useNavigate } from "react-router-dom";
import { Google } from "@lobehub/icons";
import { clsx } from "clsx";
import { useUserStore } from "../../stores/userStore.ts";

/**
 * Formulaire d'inscription
 * Permet à l'utilisateur de s'inscrire afin d'accéder au dashboard
 */
export default function RegisterForm() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_API_URL;
  const setUser = useUserStore((state) => state.setUser);

  /**
   * Configuration de react-hook-form avec validation Zod
   */
  const {
    register,
    handleSubmit,
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
      setUser(result.data);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert("Erreur lors de l'inscription : erreur interne du serveur");
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
        <div>
          <div className={clsx("mb-1 flex justify-between")}>
            <label
              className={clsx(
                "block text-left text-sm font-medium text-black",
                "dark:text-white"
              )}
            >
              Username
            </label>
            {errors.userName && (
              <p className={clsx("mt-1 text-sm text-red-500")}>
                {errors.userName.message}
              </p>
            )}
          </div>
          <input
            type="text"
            className={clsx(
              "w-full px-4 py-2",
              "rounded-sm border bg-white",
              "text-black",
              "dark:bg-gray-800 dark:text-white",
              errors.userName ? "border-red-500" : "border-gray-300"
            )}
            {...register("userName")}
          />
        </div>

        <div>
          <div className={clsx("mb-1 flex justify-between")}>
            <label
              className={clsx(
                "block text-left text-sm font-medium text-black",
                "dark:text-white"
              )}
            >
              Email
            </label>
            {errors.email && (
              <p className={clsx("mt-1 text-sm text-red-500")}>
                {errors.email.message}
              </p>
            )}
          </div>
          <input
            type="email"
            className={clsx(
              "w-full px-4 py-2",
              "rounded-sm border bg-white",
              "text-black",
              "dark:bg-gray-800 dark:text-white",
              errors.email ? "border-red-500" : "border-gray-300"
            )}
            {...register("email")}
          />
        </div>

        <div>
          <div className={clsx("mb-1 flex justify-between")}>
            <label
              className={clsx(
                "block text-left text-sm font-medium text-black",
                "dark:text-white"
              )}
            >
              Password
            </label>
            {errors.password && (
              <p className={clsx("mt-1 text-sm text-red-500")}>
                {errors.password.message}
              </p>
            )}
          </div>
          <input
            type="password"
            className={clsx(
              "w-full px-4 py-2",
              "rounded-sm border bg-white",
              "text-black",
              "dark:bg-gray-800 dark:text-white",
              errors.password ? "border-red-500" : "border-gray-300"
            )}
            {...register("password")}
          />
        </div>

        <button
          type="submit"
          className={clsx(
            "w-full py-2 font-semibold text-white",
            "rounded-sm bg-cyan-500 hover:bg-cyan-600"
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
          Already have an account ?
        </span>
        <a
          className={clsx("font-medium text-blue-500 hover:underline")}
          href="/"
        >
          Login
        </a>
      </p>
    </div>
  );
}
