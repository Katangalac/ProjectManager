import { clsx } from "clsx";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { User } from "../../types/User";

/**
 * Propriétés du ProfileHeader
 * - user : l'utilisateur dont on affiche le profile
 * - isEditable : détermine si oui ou nom l'utilisateur peut modifier le profil,
 *                le profil est modifiable que son propriétaire

 */
type ProfileHeaderProps = {
  user: User;
  isEditable: boolean;
};

/**
 * En-têce du profil de l'utilisateur
 * @param {ProfileHeaderProps} param0 - Propriétés du ProfileHeader
 */
export default function ProfileHeader({
  user,
  isEditable,
}: ProfileHeaderProps) {
  return (
    <div
      className={clsx(
        "flex items-center gap-4 px-7 py-4",
        "rounded-sm border border-gray-300"
      )}
    >
      {!user.imageUrl && (
        <div
          className={clsx(
            "flex h-fit max-h-fit w-fit max-w-fit items-center justify-center",
            "rounded-full",
            "text-gray-500"
          )}
        >
          <UserCircleIcon className={clsx("size-20")} />
        </div>
      )}

      <div className={clsx("flex flex-col")}>
        <div className={clsx("flex gap-2")}>
          {user.firstName && (
            <span className={clsx("font-medium text-black")}>
              {user.firstName}
            </span>
          )}
          {user.lastName && (
            <span className={clsx("font-medium text-black")}>
              {user.lastName}
            </span>
          )}
          {!user.firstName && (
            <span className={clsx("font-medium text-black")}>
              {user.userName}
            </span>
          )}
        </div>

        <div className={clsx("flex flex-col items-start")}>
          {user.profession && (
            <span className={clsx("text-sm text-gray-500")}>
              {user.profession}
            </span>
          )}
          <span className={clsx("text-sm text-gray-500")}>{user.email}</span>
        </div>
      </div>
    </div>
  );
}
