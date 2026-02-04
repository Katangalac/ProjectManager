import SideBar from "../components/navigation/SideBar";
import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { clsx } from "clsx";
import { useState } from "react";
import { PageMetaProvider } from "@/components/commons/PageMetaProvider";
import { usePageKey } from "@/hooks/utils/usePageKey";
import { usePageMeta } from "@/hooks/utils/usePageMeta";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Layout principal de l'application
 */
export default function MainLayout() {
  const [sideBarIsCollapsed, setSideBarIsCollapsed] = useState(false);
  const pageKey = usePageKey();
  const meta = usePageMeta(pageKey);

  return (
    <PageMetaProvider key={pageKey} initialMeta={meta}>
      <div className={clsx("flex h-screen w-screen overflow-hidden")}>
        <SideBar
          isCollapsed={sideBarIsCollapsed}
          onToogle={() => setSideBarIsCollapsed(!sideBarIsCollapsed)}
        />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className={clsx(
            "flex h-full flex-col",
            "bg-white",
            "dark:bg-gray-900",
            sideBarIsCollapsed ? "w-[calc(100%-64px)]" : "w-[calc(100%-200px)]"
          )}
        >
          <Header />
          <main className="h-full w-full overflow-y-auto bg-white dark:bg-gray-900">
            <Outlet />
          </main>
        </motion.div>
      </div>
    </PageMetaProvider>
  );
}
