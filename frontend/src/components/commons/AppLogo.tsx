import { clsx } from "clsx";
import { ChartDonutIcon } from "@phosphor-icons/react/ChartDonut";
import { cn } from "@/lib/utils";

type AppLogoProps = {
  showText: boolean;
  className?: string;
  iconSize?: number;
  iconColor?: string;
  iconWeight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
};

/**
 * Affiche le logo de l'application
 */
export default function AppLogo({
  showText,
  className,
  iconSize = 20,
  iconColor,
  iconWeight = "fill",
}: AppLogoProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center font-bold text-sky-500",
        className
      )}
    >
      <ChartDonutIcon
        size={showText ? iconSize : iconSize + 4}
        weight={iconWeight}
        className={cn(iconColor)}
      />
      {showText && (
        <span className={clsx("text-left", "dark:font-white")}>
          ProjectFlow
        </span>
      )}
    </div>
  );
}
