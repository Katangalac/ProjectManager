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
    <div className={clsx("flex h-screen w-screen flex-col overflow-hidden")}>
      <SideBar
        isCollapsed={sideBarIsCollapsed}
        onToogle={() => setSideBarIsCollapsed(!sideBarIsCollapsed)}
      />

      <div
        className={clsx(
          "flex h-full flex-1 flex-col",
          "bg-white",
          "dark:bg-gray-900",
          sideBarIsCollapsed ? "ml-16" : "ml-50"
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
