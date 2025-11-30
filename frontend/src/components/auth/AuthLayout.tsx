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
          "hidden flex-1 items-center justify-center p-8 lg:flex",
          "bg-cyan-500",
          "dark:bg-cyan-700"
        )}
      >
        <div className={clsx("max-w-md text-center")}>
          {/*<img src="/assets/project_illustration.svg" alt="Project management" className="w-full" />*/}
          <h2 className={clsx("mt-6 text-2xl font-bold")}>
            Gérez vos projets plus intelligemment.
          </h2>
          <p className={clsx("mt-2 text-gray-500", "dark:text-gray-400")}>
            Formez vos équipes, planifiez vos tâches et collaborez en temps
            réel, le tout sur une seule plateforme.
          </p>
        </div>
      </div>
    </div>
  );
}
