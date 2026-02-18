import { ComponentType } from "react";
import { clsx } from "clsx";
import { NavLink } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

type IconWeightProps = "fill" | "regular" | "bold" | "duotone" | "light";

/**
 * Type des propriétés d'un NavItem
 * - to : route de la page vers laquelle le NavItem rédirige
 * - icon : icone du NavItem
 * - label : titre ou nom du NavItem
 */
type NavItemProps = {
  icon: ComponentType<{
    size?: number;
    weight?: IconWeightProps;
    className?: string;
  }>;
  label: string;
  to: string;
  showText: boolean;
};

/**
 * Composant représentant une option d'un menu de navigation
 * @param {NavItemProps} param0 - les propriétés du NavItem
 */
export default function NavItem({
  icon: NavIcon,
  label,
  to,
  showText,
}: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "relative flex items-center gap-2 p-2",
          "rounded-md",
          "text-sm font-medium text-gray-500",
          "transition-colors",
          "dark:text-white",
          isActive
            ? "border border-sky-300 bg-sky-50 text-sky-500 dark:bg-gray-900"
            : "hover:bg-sky-50 dark:hover:bg-gray-800",
          showText ? "justify-start" : "justify-center"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={clsx(isActive ? "text-sky-500" : "stroke-1")}>
                <NavIcon
                  weight={isActive ? "fill" : "bold"}
                  className={clsx(
                    "stroke-1",
                    isActive ? "text-sky-500" : "",
                    showText ? "size-4.5" : "size-5"
                  )}
                />
              </span>
            </TooltipTrigger>
            <TooltipContent>{showText ? "" : label}</TooltipContent>
          </Tooltip>

          <AnimatePresence>
            {showText && (
              <motion.span
                initial={false}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="whitespace-nowrap"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </>
      )}
    </NavLink>
  );
}
