import { User } from "../../types/User";
import { clsx } from "clsx";
import ProfileHeader from "./ProfileHeader";
import ProfileUserInfo from "./ProfileUserInfos";

/**
 * Propriétés du PublicUserProps
 *
 * - user : l'utilisateur dont on affiche le profil
 */
type PublicProfileProps = {
  user: User;
};

/**
 * Affiche le profil public d'un utilisateur
 * Le profil public est celui qui s'affiche lorsqu'un utilisateur
 * veut voir le profil d'un autre
 *
 * @param {PublicProfileProps} param0 - Propriétés du PublicProfileProps
 */
export default function PublicProfile({ user }: PublicProfileProps) {
  return (
    <div
      className={clsx(
        "flex min-h-screen flex-col gap-6",
        "bg-white dark:bg-gray-900"
      )}
    >
      <h2
        className={clsx(
          "mb-2 text-left text-lg font-medium text-black",
          "dark:text-white"
        )}
      >
        Profile
      </h2>
      <ProfileHeader user={user} isEditable={false} />
      <ProfileUserInfo user={user} isEditable={false} />
    </div>
  );
}
