import { ReactNode } from "react";
import { clsx } from "clsx";
import { NavLink } from "react-router-dom";

/**
 * Type des propriétés d'un NavItem
 * - to : route de la page vers laquelle le NavItem rédirige
 * - icon : icone du NavItem
 * - label : titre ou nom du NavItem
 */
type NavItemProps = {
  icon: ReactNode;
  label: string;
  to: string;
};

/**
 * Composant représentant une option d'un menu de navigation
 * @param {NavItemProps} param0 - les propriétés du NavItem
 */
export default function NavItem({ icon, label, to }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "relative flex items-center gap-2 p-2",
          "rounded-lg",
          "text-sm text-gray-500",
          "transition-colors",
          "dark:text-white",
          isActive
            ? "bg-white dark:bg-gray-900"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={clsx(
              "h-full w-1.5",
              "rounded-r-full transition-all",
              isActive ? "bg-cyan-500 dark:bg-cyan-600" : "bg-transparent"
            )}
          ></span>
          <span className={clsx(isActive ? "text-cyan-500" : "")}>{icon}</span>
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}
