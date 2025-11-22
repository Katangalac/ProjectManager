import { User } from "../../types/User";
import { clsx } from "clsx";
import ProfileHeader from "./ProfileHeader";
import ProfileUserInfo from "./ProfileUserInfos";

/**
 * Propriétés du PrivateProfile
 *
 * - user : l'utilisateur dont on veut afficher le profil
 */
type PrivateProfileProps = {
  user: User;
};

/**
 * Affiche le profil public d'un utilisateur
 * Le profil public est celui qui s'affiche lorsqu'un utilisateur
 * veut voir le profil d'un autre
 *
 * @param param0 - Propriétés du PrivateProfileProps
 */
export default function PrivateProfile({ user }: PrivateProfileProps) {
  return (
    <div
      className={clsx(
        "flex min-h-screen flex-col gap-6",
        "bg-white dark:bg-gray-900"
      )}
    >
      <h2 className="mb-2 text-left text-lg font-medium text-black">Profile</h2>
      <ProfileHeader user={user} isEditable={false} />
      <ProfileUserInfo user={user} isEditable={false} />
    </div>
  );
}
