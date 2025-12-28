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
  showText: boolean;
};

/**
 * Composant représentant une option d'un menu de navigation
 * @param {NavItemProps} param0 - les propriétés du NavItem
 */
export default function NavItem({ icon, label, to, showText }: NavItemProps) {
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
            ? "border border-sky-300 bg-sky-100 text-sky-600 dark:bg-gray-900"
            : "hover:bg-sky-100 dark:hover:bg-gray-800"
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={clsx(isActive ? "text-sky-600" : "")}
            title={showText ? "" : label}
          >
            {icon}
          </span>
          {showText && <span>{label}</span>}
        </>
      )}
    </NavLink>
  );
}
