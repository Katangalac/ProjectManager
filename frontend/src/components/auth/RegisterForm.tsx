import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../schemas/auth.schemas.ts";
import {RegisterInputs} from "../../types/Auth.ts";
import { useNavigate } from "react-router-dom";
import { Google } from "@lobehub/icons";

/**
 * Formulaire d'inscription
 * Permet à l'utilisateur de s'inscrire afin d'accéder au dashboard
 */
export default function RegisterForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterInputs) => {
    console.log("Register data:", data);
    navigate("/dashboard");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 p-8">
      <h2 className="text-3xl text-black font-bold text-center mb-4 dark:text-white">
        Créer un compte
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-left text-black block text-sm font-medium dark:text-white">
                Nom d'utilisateur
            </label>
            {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>
          <input
            type="text"
            className={`w-full px-4 py-2 border rounded-sm bg-white dark:bg-gray-800 dark:text-white ${
                errors.username ? "border-red-500" : "border-gray-300"
            }`}
            {...register("username")}
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-left text-black block text-sm font-medium dark:text-white">
                Email
            </label> 
            {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}          
          </div>
          <input
            type="email"
            className={`w-full px-4 py-2 border rounded-sm bg-white dark:bg-gray-800 dark:text-white ${
                errors.email ? "border-red-500" : "border-gray-300"
            }`}
            {...register("email")}
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-left text-black block mb-1 text-sm font-medium dark:text-white">
                Mot de passe
            </label>
            {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}          
          </div>
          <input
            type="password"
            className={`w-full px-4 py-2 border rounded-sm bg-white dark:bg-gray-800 dark:text-white ${
                errors.password ? "border-red-500" : "border-gray-300"
            }`}
            {...register("password")}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 font-semibold rounded-sm bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          Créer un compte
        </button>
      </form>

      <div className="relative flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm font-medium whitespace-nowrap">
            Ou s'inscrire avec
            </span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div>
        <button className="flex text-gray-600 font-medium w-full px-2 py-2 border border-gray-300 rounded-sm items-center justify-center gap-2 bg-gray-50 hover:bg-gray-200">
          <Google.Color size={16} /> Google
        </button>
      </div>

      <p className="mt-6 text-center text-sm">
        <span className="text-gray-500 dark:text-gray-400 font-medium">Vous avez déjà un compte ? </span>
        <a href="/" className="text-blue-500 font-medium hover:underline">
          Se connecter
        </a>
      </p>
    </div>
  );
};