import { clsx } from "clsx";
import AppLogo from "./AppLogo";
import NavItem from "./NavItem";
import {
  UsersThreeIcon,
  UserIcon,
  ChatDotsIcon,
  SquaresFourIcon,
  ListDashesIcon,
  SignOutIcon,
  CalendarDotsIcon,
} from "@phosphor-icons/react";

export default function SideBar() {
  return (
    <aside
      className={clsx(
        "flex min-h-screen w-64 flex-col px-5 shadow-lg shadow-gray-500",
        "border-r border-gray-400 bg-white",
        "dark:bg-gray-900"
      )}
    >
      <div
        className={clsx(
          "mb-3 flex h-16 items-center justify-start",
          "border-b",
          "text-left text-lg font-bold",
          "dark:border-none"
        )}
      >
        <a href="/dashboard" className={clsx("w-fit")}>
          <AppLogo />
        </a>
      </div>

      <h3
        className={clsx(
          "text-left font-medium text-gray-600",
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
          "text-left font-medium text-gray-600",
          "dark:text-gray-400"
        )}
      >
        General
      </h3>
      <nav className={clsx("flex h-fit flex-col space-y-1 py-4")}>
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
