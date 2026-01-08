import { User } from "../types/User";
import { useUserStore } from "../stores/userStore";
import { getUserById } from "../api/user.api";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import PublicProfile from "../components/profile/PublicProfile";
import PrivateProfile from "../components/profile/PrivateProfile";
import { useParams } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";

/**
 * Affiche le profil de l'utilisateur
 */
export default function ProfilePage() {
  const { id } = useParams();
  const currentUser = useUserStore((s) => s.user);
  const isOwnProfile = !id || (currentUser && currentUser.id === id);
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (isOwnProfile) {
      setViewedUser(currentUser);
      setLoading(false);
    } else {
      getUserById(id)
        .then((res) => {
          setViewedUser(res?.data ?? null);
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération de l'utilisateur :",
            error
          );
          setViewedUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentUser, id, isOwnProfile]);

  return (
    <div
      className={clsx(
        "min-h-screen w-full p-4",
        "bg-white",
        "dark:bg-gray-900"
      )}
    >
      {loading && <ProgressSpinner strokeWidth="5" />}
      {isOwnProfile && viewedUser && <PrivateProfile user={viewedUser} />}
      {!isOwnProfile && viewedUser && <PublicProfile user={viewedUser} />}

      {!loading && !viewedUser && (
        <div className={clsx("flex flex-col gap-2")}>
          <span className={clsx("text-black dark:text-white")}>
            Utilisateur non défini
          </span>
        </div>
      )}
    </div>
  );
}
