import { ReactNode } from "react";
import { clsx } from "clsx";
import { NavLink } from "react-router-dom";

export default function NavItem({
  icon,
  label,
  to,
}: {
  icon: ReactNode;
  label: string;
  to: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "relative flex items-center gap-2 p-2",
          "rounded-lg",
          "text-gray-700",
          "transition-colors",
          "dark:text-white",
          isActive
            ? "bg-white dark:bg-gray-900"
            : "hover:bg-gray-200 dark:hover:bg-gray-800"
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={clsx(
              "absolute top-0 left-0 h-full w-1.5",
              "rounded-r transition-all",
              isActive ? "bg-cyan-500 dark:bg-cyan-600" : "bg-transparent"
            )}
          ></span>
          {icon}
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}
