import { clsx } from "clsx";
import AppLogo from "../commons/AppLogo";
import NavItem from "./NavItem";
import {
  UsersThreeIcon,
  UserIcon,
  ChatDotsIcon,
  SquaresFourIcon,
  ListDashesIcon,
  SignOutIcon,
  CalendarDotsIcon,
  GearIcon,
} from "@phosphor-icons/react";

/**
 * Barre de navigation latéral
 * Permet de naviguer entre les pages de l'application
 */
export default function SideBar() {
  return (
    <aside
      className={clsx(
        "flex min-h-screen flex-col px-5 lg:min-w-60",
        "border-r border-gray-300 bg-white",
        "dark:bg-gray-900",
        "dark:border-gray-500"
      )}
    >
      <div
        className={clsx(
          "mb-3 flex h-16 items-center justify-start",
          "border-b",
          "text-left font-bold",
          "dark:border-none"
        )}
      >
        <a href="/dashboard" className={clsx("w-fit")}>
          <AppLogo />
        </a>
      </div>

      <h3
        className={clsx(
          "text-left text-sm font-medium text-gray-600",
          "dark:text-gray-400"
        )}
      >
        Menu
      </h3>

      <nav className={clsx("flex h-fit flex-col space-y-1 py-4")}>
        <NavItem
          icon={<SquaresFourIcon size={18} weight="regular" />}
          label="Dashboard"
          to="/dashboard"
        />
        <NavItem
          icon={<ListDashesIcon size={18} weight="regular" />}
          label="Tâches"
          to="/tasks"
        />
        <NavItem
          icon={<CalendarDotsIcon size={18} weight="regular" />}
          label="Calendrier"
          to="/calendar"
        />
        <NavItem
          icon={<UsersThreeIcon size={18} weight="regular" />}
          label="Équipes"
          to="/teams"
        />
        <NavItem
          icon={<ChatDotsIcon size={18} weight="regular" />}
          label="Chat"
          to="/chat"
        />
      </nav>

      <div className={clsx("mb-3 w-full border-t border-gray-300")}></div>

      <h3
        className={clsx(
          "text-left text-sm font-medium text-gray-600",
          "dark:text-gray-400"
        )}
      >
        General
      </h3>
      <nav className={clsx("flex h-fit flex-col space-y-1 py-4")}>
        <NavItem
          icon={<GearIcon size={18} weight="regular" />}
          label="Paramètres"
          to="/settings"
        />
        <NavItem
          icon={<UserIcon size={18} weight="regular" />}
          label="Profile"
          to="/profile"
        />
        <NavItem
          icon={<SignOutIcon size={18} weight="regular" />}
          label="Déconnexion"
          to="/logout"
        />
      </nav>
    </aside>
  );
}
