import { clsx } from "clsx";
import { ChartDonutIcon } from "@phosphor-icons/react/ChartDonut";

/**
 * Affiche le logo de l'application
 */
export default function AppLogo() {
  return (
    <div className={clsx("flex items-center text-cyan-500")}>
      <ChartDonutIcon size={20} weight="fill" />
      <p
        className={clsx(
          "text-left font-bold text-cyan-500",
          "dark:font-white dark:text-cyan-500"
        )}
      >
        ProjectFlow
      </p>
    </div>
  );
}
