/* import { useParams } from "react-router-dom"; */
import { useUserStore } from "../stores/userStore";
/* import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getUserById } from "../services/user.services";
import { getMe } from "../services/auth.services"; */
import { clsx } from "clsx";
import PublicProfile from "../components/profile/PublicProfile";

export default function ProfilePage() {
  //const { id } = useParams(); // peut être undefined
  const currentUser = useUserStore((s) => s.user);
  /* const [viewedUser, setViewedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const isOwnProfile = !id || (currentUser && currentUser.id === id); */

  return (
    <div
      className={clsx("min-h-screen w-full", "bg-white", "dark:bg-gray-900")}
    >
      {currentUser && <PublicProfile user={currentUser} />}

      {!currentUser && (
        <div className={clsx("flex flex-col gap-2")}>
          <span className={clsx("text-black dark:text-white")}>
            Utilisateur non défini
          </span>
        </div>
      )}
    </div>
  );
}
