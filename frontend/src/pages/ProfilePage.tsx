/* import { useParams } from "react-router-dom"; */
import { useUserStore } from "../stores/userStore";
/* import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getUserById } from "../services/user.services";
import { getMe } from "../services/auth.services"; */
import { clsx } from "clsx";

export default function ProfilePage() {
  //const { id } = useParams(); // peut être undefined
  const currentUser = useUserStore((s) => s.user);
  /* const [viewedUser, setViewedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const isOwnProfile = !id || (currentUser && currentUser.id === id); */

  return (
    <>
      {currentUser && (
        <div className={clsx("flex flex-col gap-2")}>
          <span className={clsx("text-black dark:text-white")}>
            Nom d'utilisateur : {currentUser.userName}
          </span>
          <span className={clsx("text-black dark:text-white")}>
            Email : {currentUser.email}
          </span>
          <span className={clsx("text-black dark:text-white")}>
            Prénom : {currentUser.firstName}
          </span>
          <span className={clsx("text-black dark:text-white")}>
            Nom : {currentUser.lastName}
          </span>
          <span className={clsx("text-black dark:text-white")}>
            Téléphone : {currentUser.phoneNumber}
          </span>
          <span className={clsx("text-black dark:text-white")}>
            Profession : {currentUser.profession}
          </span>
          <span className={clsx("text-black dark:text-white")}>
            Dernière connexion : {currentUser.lastLoginAt?.toString()}
          </span>
          <span className={clsx("text-black dark:text-white")}>
            Compte créé le : {currentUser.createdAt.toString()}
          </span>
        </div>
      )}

      {!currentUser && (
        <div className={clsx("flex flex-col gap-2")}>
          <span className={clsx("text-black dark:text-white")}>
            Utilisateur non défini
          </span>
        </div>
      )}
    </>
  );
}
