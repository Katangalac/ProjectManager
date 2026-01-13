import { clsx } from "clsx";
import AppLogo from "../commons/AppLogo";
import NavItem from "./NavItem";
import { useUserStore } from "../../stores/userStore";
import { useNavigate } from "react-router-dom";
import {
  SignOutIcon,
  CalendarDotsIcon,
  HouseIcon,
  CaretCircleRightIcon,
  CaretCircleLeftIcon,
  FlaskIcon,
  ClipboardTextIcon,
  UsersThreeIcon,
  UserCircleIcon,
  FolderIcon,
  ChatTextIcon,
} from "@phosphor-icons/react";
import { socket } from "@/lib/socket/socketClient";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

/**
 * Propriétés du SideBar
 *
 * - isCollapsed: état du SideBar (Rétracté ou Ouvert)
 * - onToogle: fonction qui permet de modifier l'état du SideBar
 */
type SideBarProps = {
  isCollapsed: boolean;
  onToogle: () => void;
};

/**
 * Barre de navigation latéral
 * Permet de naviguer entre les pages de l'application
 */
export default function SideBar({ isCollapsed, onToogle }: SideBarProps) {
  const { logout, user } = useUserStore();
  const navigate = useNavigate();

  /**
   * Gère la déconnexion de l'utilisateur
   */
  const handleLogout = async () => {
    await logout();
    socket.emit("logout", user?.id);
    navigate("/login");
  };

  return (
    <div className={clsx("fixed top-0 left-0 h-screen")}>
      <aside
        className={clsx(
          "relative flex min-h-screen flex-col px-3 py-5",
          "border-r border-gray-300 bg-white",
          "dark:bg-gray-900",
          "dark:border-gray-500",
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-50"
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={clsx(
                "absolute top-2 -right-2 h-fit w-fit",
                "rounded-full bg-white",
                "text-gray-400",
                "dark:bg-gray-900"
              )}
              onClick={onToogle}
            >
              {!isCollapsed ? (
                <span>
                  <CaretCircleLeftIcon size={18} weight="regular" />
                </span>
              ) : (
                <span>
                  <CaretCircleRightIcon size={18} weight="regular" />
                </span>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {isCollapsed ? "Open sidebar" : "Close sidebar"}
          </TooltipContent>
        </Tooltip>

        <div
          className={clsx(
            "mb-6 flex h-fit items-center",
            "text-left font-bold",
            isCollapsed ? "px-2" : ""
          )}
        >
          <a href="/dashboard">
            <AppLogo showText={!isCollapsed} />
          </a>
        </div>

        {!isCollapsed && (
          <h3
            className={clsx(
              "text-left text-sm font-bold text-gray-600",
              "dark:text-gray-400"
            )}
          >
            Main Menu
          </h3>
        )}

        <nav
          className={clsx(
            "flex h-fit flex-col space-y-1",
            "transition-all duration-300",
            !isCollapsed ? "py-4" : "py-1"
          )}
        >
          <NavItem
            icon={HouseIcon}
            label="Dashboard"
            to="/dashboard"
            showText={!isCollapsed}
          />
          <NavItem
            icon={FolderIcon}
            label="Projects"
            to="/userProjects"
            showText={!isCollapsed}
          />
          <NavItem
            icon={ClipboardTextIcon}
            label="Tasks"
            to="/userTasks"
            showText={!isCollapsed}
          />
          <NavItem
            icon={CalendarDotsIcon}
            label="Calendar"
            to="/calendar"
            showText={!isCollapsed}
          />
          <NavItem
            icon={UsersThreeIcon}
            label="Teams"
            to="/userTeams"
            showText={!isCollapsed}
          />
          {/* <NavItem
            icon={ChatTextIcon}
            label="Messages"
            to="/messages"
            showText={!isCollapsed}
            
          /> */}

          {/* <NavItem
            icon={FlaskIcon}
            label="Test"
            to="/test"
            showText={!isCollapsed}
          /> */}
        </nav>

        <div
          className={clsx(
            "mb-3 w-full border-t border-gray-300",
            !isCollapsed ? "mt-3" : ""
          )}
        ></div>

        {!isCollapsed && (
          <h3
            className={clsx(
              "text-left text-sm font-bold text-gray-600",
              "dark:text-gray-400"
            )}
          >
            Account
          </h3>
        )}

        <nav
          className={clsx(
            "flex h-fit flex-1 flex-col justify-between space-y-1",
            "transition-all duration-300",
            !isCollapsed ? "py-4" : "py-1"
          )}
        >
          <NavItem
            icon={UserCircleIcon}
            label="Profile"
            to="/profile"
            showText={!isCollapsed}
          />

          <button
            className={clsx(
              "flex items-center gap-2 p-2",
              "rounded-md bg-white hover:bg-red-100",
              "text-sm font-medium text-red-500",
              "transition-colors",
              "dark:text-red-500",
              "dark:bg-gray-900 dark:hover:bg-gray-800",
              isCollapsed ? "w-fit" : ""
            )}
            onClick={handleLogout}
          >
            <span>
              <SignOutIcon
                weight="bold"
                className={clsx(isCollapsed ? "size-5" : "size-4.5")}
              />
            </span>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </nav>
      </aside>
    </div>
  );
}
