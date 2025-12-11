import SideBar from "../components/navigation/SideBar";
import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { clsx } from "clsx";
import { useState } from "react";

/**
 * Layout principal de l'application
 */
export default function MainLayout() {
  const [sideBarIsCollapsed, setSideBarIsCollapsed] = useState(false);
  return (
    <div>
      <SideBar
        isCollapsed={sideBarIsCollapsed}
        onToogle={() => setSideBarIsCollapsed(!sideBarIsCollapsed)}
      />
      <Header className={clsx(sideBarIsCollapsed ? "ml-16" : "ml-50")} />
      <div
        className={clsx(
          "flex-1 p-4",
          "bg-white",
          "dark:bg-gray-900",
          sideBarIsCollapsed ? "ml-16" : "ml-50"
        )}
      >
        <Outlet />
      </div>
      <Footer className={clsx(sideBarIsCollapsed ? "ml-16" : "ml-50")} />
    </div>
  );
}
