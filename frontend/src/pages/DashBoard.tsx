import { clsx } from "clsx";
import { useUserStore } from "../stores/userStore";
import SideBar from "../components/SideBar";

export default function DashBoard() {
  const { user } = useUserStore();

  return (
    <div className={clsx("flex")}>
      <SideBar />
      <div
        className={clsx(
          "flex min-h-screen min-w-full items-center justify-center",
          "bg-white",
          "dark:bg-gray-900"
        )}
      >
        <h1
          className={clsx("text-2xl font-bold text-black", "dark:text-white")}
        >
          Bonjour {user?.userName}! Bon retour parmi nous
        </h1>
        <a className={clsx("w-fit")} href="/profile">
          <button
            className={clsx(
              "w-fit px-2 py-2 font-semibold text-white",
              "rounded-sm bg-cyan-500 hover:bg-cyan-600"
            )}
          >
            Profile
          </button>
        </a>
      </div>
    </div>
  );
}
