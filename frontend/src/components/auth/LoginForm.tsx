import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schemas/auth.schemas.ts";
import { LoginInputs } from "../../types/Auth.ts";
import { loginRequest } from "../../services/auth/auth.services.ts";
import { useNavigate } from "react-router-dom";
import { Google } from "@lobehub/icons";

/**
 * Formulaire de connexion
 * Permet à l'utilisateur de se connecter oafin d'accéder au dashboard
 */
export default function LoginForm() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInputs>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async(data: LoginInputs) => {
       try {
            const result = await loginRequest(data.identifier, data.password);
            console.log("User logged in:", result.data);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 p-8">
            <h2 className="text-3xl text-black font-bold text-center mb-4 dark:text-white">
                Bienvenue!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-6 font-medium">
                Connectez-vous pour retrouver votre espace de travail.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <div className="flex justify-between mb-1">
                        <label className="text-left text-black block text-sm font-medium dark:text-white">
                            Nom d'utilisateur/Email
                        </label>
                        {errors.identifier && (
                            <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>
                        )}
                    </div>
                    <input
                        type="text"
                        className={`w-full px-4 py-2 border rounded-sm bg-white dark:bg-gray-800 dark:text-white ${
                            errors.identifier ? "border-red-500" : "border-gray-300"
                        }`}
                        {...register("identifier")}
                    />
                </div>

                <div>
                    <div className="flex justify-between mb-1">
                        <label className="text-left text-black block text-sm font-medium dark:text-white">
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
                    <p className="mt-2 text-right text-sm">
                        <a className="text-blue-500 font-medium hover:underline" href="/">
                            Mot de passe oublié?
                        </a>
                    </p>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 font-semibold rounded-sm bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                    Connexion
                </button>
            </form>

            <div className="relative flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500 text-sm font-medium whitespace-nowrap">
                        Ou se connecter avec
                    </span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div>
                <button className="flex text-gray-600 font-medium w-full px-2 py-2 border border-gray-300 rounded-sm items-center justify-center gap-2 bg-gray-50 hover:bg-gray-200">
                    <Google.Color size={16} /> Google
                </button>
            </div>

            <p className="mt-6 text-center text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Pas encore de compte ? </span>
                <a href="/register" className="text-blue-500 font-medium hover:underline">
                    S'inscrire
                </a>
            </p>
        </div>
    );
};
