import { clsx } from "clsx";
import AppLogo from "../commons/AppLogo";
import NavItem from "./NavItem";
import { useUserStore } from "../../stores/userStore";
import { useNavigate } from "react-router-dom";
import {
  ChatDotsIcon,
  ListDashesIcon,
  SignOutIcon,
  CalendarDotsIcon,
  GearIcon,
  HouseIcon,
  ProjectorScreenChartIcon,
} from "@phosphor-icons/react";

import { UserCircleIcon, UserGroupIcon } from "@heroicons/react/24/outline";

/**
 * Barre de navigation latéral
 * Permet de naviguer entre les pages de l'application
 */
export default function SideBar() {
  const { logout } = useUserStore();
  const navigate = useNavigate();

  /**
   * Gère la déconnexion de l'utilisateur
   */
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

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
          icon={<HouseIcon size={18} weight="regular" />}
          label="Dashboard"
          to="/dashboard"
        />
        <NavItem
          icon={<ProjectorScreenChartIcon size={18} weight="regular" />}
          label="Projets"
          to="/userProjects"
        />
        <NavItem
          icon={<ListDashesIcon size={18} weight="regular" />}
          label="Tâches"
          to="/userTasks"
        />
        <NavItem
          icon={<CalendarDotsIcon size={18} weight="regular" />}
          label="Calendrier"
          to="/calendar"
        />
        <NavItem
          icon={<UserGroupIcon className={clsx("size-4.5")} />}
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
          icon={<UserCircleIcon className={clsx("size-4.5")} />}
          label="Profile"
          to="/profile"
        />

        <button
          className={clsx(
            "flex items-center gap-2 p-2",
            "rounded-lg bg-white hover:bg-gray-100",
            "text-sm text-gray-500",
            "transition-colors",
            "dark:text-white",
            "dark:bg-gray-900 dark:hover:bg-gray-800"
          )}
          onClick={handleLogout}
        >
          <span
            className={clsx(
              "h-full w-1.5",
              "rounded-r-full transition-all",
              "bg-transparent"
            )}
          ></span>
          <span>
            <SignOutIcon size={18} weight="regular" />
          </span>
          <span>Déconnexion</span>
        </button>
      </nav>
    </aside>
  );
}
