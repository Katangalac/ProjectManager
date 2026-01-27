import { clsx } from "clsx";
import { ChartDonutIcon } from "@phosphor-icons/react/ChartDonut";
import { cn } from "@/lib/utils";
import {motion, AnimatePresence} from "framer-motion"

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

      <AnimatePresence>
        {showText && (
            <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={clsx("text-left whitespace-nowrap", "dark:font-white")}>
              ProjectFlow
            </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
