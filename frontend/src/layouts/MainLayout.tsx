import SideBar from "../components/navigation/SideBar";
import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { clsx } from "clsx";
import { useState } from "react";
import { PageMetaProvider } from "@/components/commons/PageMetaProvider";
import { usePageKey } from "@/hooks/utils/usePageKey";
import { usePageMeta } from "@/hooks/utils/usePageMeta";
import {motion} from "framer-motion";

/**
 * Layout principal de l'application
 */
export default function MainLayout() {
  const [sideBarIsCollapsed, setSideBarIsCollapsed] = useState(false);
  const pageKey = usePageKey();
  const meta = usePageMeta(pageKey);

  return (
    <PageMetaProvider key={pageKey} initialMeta={meta}>
      <div className={clsx("flex h-screen w-screen flex-col overflow-hidden")}>
        <SideBar
          isCollapsed={sideBarIsCollapsed}
          onToogle={() => setSideBarIsCollapsed(!sideBarIsCollapsed)}
        />

        <motion.div
            animate={{ marginLeft: sideBarIsCollapsed ? "4rem" : "12.5rem" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className={clsx(
            "flex h-full flex-1 flex-col",
            "bg-white",
            "dark:bg-gray-900",
          )}
        >
          <Header />
          <main className="h-full flex-1 overflow-y-auto bg-white dark:bg-gray-900">
            <Outlet />
          </main>
        </motion.div>
      </div>
    </PageMetaProvider>
  );
}
