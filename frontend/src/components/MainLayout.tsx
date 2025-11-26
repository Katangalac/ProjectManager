import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import { clsx } from "clsx";

/**
 * Layout principal de l'application
 */
export default function MainLayout() {
  return (
    <div className={clsx("flex gap-4")}>
      <SideBar />

      <div className={clsx("flex-1 p-4", "bg-white", "dark:bg-gray-900")}>
        <Outlet />
      </div>
    </div>
  );
}
