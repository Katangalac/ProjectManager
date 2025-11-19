import { clsx } from "clsx";
import { useUserStore } from "../stores/userStore";

export default function DashBoard() {
  const { user } = useUserStore();

  return (
    <div
      className={clsx(
        "flex min-h-screen min-w-full items-center justify-center",
        "bg-white",
        "dark:bg-gray-900"
      )}
    >
      <h1 className={clsx("text-2xl font-bold text-black", "dark:text-white")}>
        Bonjour {user?.userName}! Bon retour parmi nous
      </h1>
    </div>
  );
}
