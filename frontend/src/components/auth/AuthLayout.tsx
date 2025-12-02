import { ReactNode } from "react";
import { clsx } from "clsx";
import AppLogo from "../commons/AppLogo";

/**
 * Composant qui structure la page d'authentification
 * Contient le formulaire de connexion/inscription
 * @param {ReactNode} children - formulaire de connexion/inscription
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={clsx("flex min-h-screen bg-gray-50")}>
      <div
        className={clsx(
          "relative flex flex-1 flex-col items-center justify-center",
          "bg-white",
          "dark:bg-gray-900"
        )}
      >
        <div className={clsx("absolute top-10 left-10 flex items-center")}>
          <AppLogo showText={true} />
        </div>
        {children}
      </div>
      <div
        className={clsx(
          "relative hidden flex-1 items-center p-8 lg:flex",
          "bg-[url('/images/im5.jpg')] bg-cover bg-center"
        )}
      >
        {/**Overlay pour gérer l'apparence de l'image de fond */}
        <div className={clsx("absolute inset-0 bg-black/40")}></div>

        <div
          className={clsx(
            "relative flex h-full w-full flex-col justify-end py-4 text-left"
          )}
        >
          <h2
            className={clsx(
              "mt-6 stroke-black stroke-1 text-3xl font-bold text-gray-200"
            )}
            style={{ WebkitTextStroke: "0.5px black" }}
          >
            Gérer vos projets efficacement!
          </h2>
          <p
            className={clsx("mt-2 text-lg font-medium text-gray-200")}
            style={{ WebkitTextStroke: "0.5px black" }}
          >
            Connectez vous et accéder à votre espace de travail.
          </p>
          <p
            className={clsx("mt-2 text-lg font-medium text-gray-200")}
            style={{ WebkitTextStroke: "0.5px black" }}
          >
            Formez vos équipes, planifiez vos tâches et collaborez en temps
            réel, le tout sur une seule plateforme.
          </p>
        </div>
      </div>
    </div>
  );
}
