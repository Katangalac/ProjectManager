import { clsx } from "clsx";
import { ChartDonutIcon } from "@phosphor-icons/react/ChartDonut";

type AppLogoProps = {
  showText: boolean;
};

/**
 * Affiche le logo de l'application
 */
export default function AppLogo({ showText }: AppLogoProps) {
  return (
    <div className={clsx("flex items-center justify-center text-sky-600")}>
      <ChartDonutIcon size={showText ? 20 : 24} weight="fill" />
      {showText && (
        <span
          className={clsx(
            "text-left font-bold text-sky-600",
            "dark:font-white dark:text-sky-600"
          )}
        >
          ProjectFlow
        </span>
      )}
    </div>
  );
}
