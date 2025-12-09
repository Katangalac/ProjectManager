import { clsx } from "clsx";
import AppLogo from "../commons/AppLogo";
import NavItem from "./NavItem";
import { useUserStore } from "../../stores/userStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ChatDotsIcon,
  SignOutIcon,
  CalendarDotsIcon,
  GearIcon,
  HouseIcon,
  ProjectorScreenChartIcon,
  CaretCircleRightIcon,
  CaretCircleLeftIcon,
} from "@phosphor-icons/react";

import {
  UserCircleIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

/**
 * Barre de navigation latéral
 * Permet de naviguer entre les pages de l'application
 */
export default function SideBar() {
  const { logout } = useUserStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

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
        "relative flex min-h-screen flex-col px-3 py-5",
        "border-r border-gray-300 bg-white",
        "dark:bg-gray-900",
        "dark:border-gray-500",
        "transition-all duration-300 ease-in-out",
        open ? "w-50" : "w-16"
      )}
    >
      <button
        className={clsx(
          "absolute top-2 -right-2 h-fit w-fit",
          "rounded-full bg-white",
          "text-gray-400",
          "dark:bg-gray-900"
        )}
        title={open ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <span>
            <CaretCircleLeftIcon size={18} weight="regular" />
          </span>
        ) : (
          <span>
            <CaretCircleRightIcon size={18} weight="regular" />
          </span>
        )}
      </button>

      <div
        className={clsx(
          "mb-4 flex h-fit items-center",
          "text-left font-bold",
          !open ? "px-2" : ""
        )}
      >
        <a href="/dashboard">
          <AppLogo showText={open} />
        </a>
      </div>

      {open && (
        <h3
          className={clsx(
            "text-left text-sm font-medium text-gray-600",
            "dark:text-gray-400"
          )}
        >
          Menu
        </h3>
      )}

      <nav
        className={clsx(
          "flex h-fit flex-col space-y-1",
          "transition-all duration-300",
          open ? "py-4" : "py-1"
        )}
      >
        <NavItem
          icon={<HouseIcon size={open ? 18 : 22} weight="regular" />}
          label="Dashboard"
          to="/dashboard"
          showText={open}
        />
        <NavItem
          icon={
            <ProjectorScreenChartIcon size={open ? 18 : 22} weight="regular" />
          }
          label="Projects"
          to="/userProjects"
          showText={open}
        />
        <NavItem
          icon={
            <ClipboardDocumentListIcon
              className={clsx(open ? "size-4.5" : "size-5.5")}
            />
          }
          label="Tasks"
          to="/userTasks"
          showText={open}
        />
        <NavItem
          icon={<CalendarDotsIcon size={open ? 18 : 22} weight="regular" />}
          label="Calendar"
          to="/calendar"
          showText={open}
        />
        <NavItem
          icon={
            <UserGroupIcon className={clsx(open ? "size-4.5" : "size-5.5")} />
          }
          label="Teams"
          to="/teams"
          showText={open}
        />
        <NavItem
          icon={<ChatDotsIcon size={open ? 18 : 22} weight="regular" />}
          label="Chat"
          to="/chat"
          showText={open}
        />
      </nav>

      <div
        className={clsx(
          "mb-3 w-full border-t border-gray-300",
          !open ? "mt-3" : ""
        )}
      ></div>

      {open && (
        <h3
          className={clsx(
            "text-left text-sm font-medium text-gray-600",
            "dark:text-gray-400"
          )}
        >
          General
        </h3>
      )}

      <nav
        className={clsx(
          "flex h-fit flex-col space-y-1",
          "transition-all duration-300",
          open ? "py-4" : "py-1"
        )}
      >
        <NavItem
          icon={<GearIcon size={open ? 18 : 22} weight="regular" />}
          label="Settings"
          to="/settings"
          showText={open}
        />
        <NavItem
          icon={
            <UserCircleIcon className={clsx(open ? "size-4.5" : "size-5.5")} />
          }
          label="Profile"
          to="/profile"
          showText={open}
        />

        <button
          className={clsx(
            "flex items-center gap-2 p-2",
            "rounded-lg bg-white hover:bg-gray-100",
            "text-sm text-red-500",
            "transition-colors",
            "dark:text-red-500",
            "dark:bg-gray-900 dark:hover:bg-gray-800",
            !open ? "w-fit" : ""
          )}
          onClick={handleLogout}
        >
          <span>
            <SignOutIcon size={open ? 18 : 22} weight="regular" />
          </span>
          {open && <span>Logout</span>}
        </button>
      </nav>
    </aside>
  );
}
