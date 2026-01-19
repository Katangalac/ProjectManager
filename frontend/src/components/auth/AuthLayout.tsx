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
    <div className={clsx("flex min-h-screen bg-white")}>
      <div
        className={clsx(
          "relative flex flex-1 flex-col items-center justify-center",
          "bg-white",
          "dark:bg-gray-900"
        )}
      >
        <div className={clsx("absolute top-10 left-10 flex items-center")}>
          <AppLogo
            showText={true}
            className={clsx("text-xl font-bold")}
            iconSize={25}
          />
        </div>
        {children}
      </div>
      <div
        className={clsx(
          "b-custom relative flex-1 items-center justify-center overflow-hidden bg-sky-500 lg:flex",
          "m-5 rounded-xl rounded-bl-[20%]"
        )}
      >
        {/* *Overlay pour gérer l'apparence de l'image de fond
        <div className={clsx("absolute inset-0 bg-black/20")}></div> */}
        <div
          className={clsx(
            "flex h-full w-full flex-col justify-center gap-4 px-8 py-16 text-left text-white text-shadow-lg"
          )}
        >
          <div className={clsx("flex w-full flex-col items-center gap-10")}>
            <AppLogo
              showText={true}
              className={clsx("text-3xl font-bold text-white")}
              iconSize={35}
              iconColor="text-white"
              iconWeight="bold"
            />
            <img src="/icons/loginSvg.svg" alt="Not found" className="h-60" />
          </div>
          <div className={clsx("flex w-full flex-col gap-1")}>
            <h2 className={clsx("mb-4 text-center text-2xl font-bold")}>
              Manage your projects efficiently!
            </h2>
            <p className={clsx("text-lg font-medium")}>
              Login to access your workspace.
            </p>
            <p className={clsx("text-lg font-medium")}>
              Create teams, manage tasks, and collaborate with your peers, all
              in one plateform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
