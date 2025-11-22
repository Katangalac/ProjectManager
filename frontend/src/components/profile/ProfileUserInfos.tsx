import { clsx } from "clsx";
import { User } from "../../types/User";

/**
 * Propriétés du ProfileUserInfos
 * - user : l'utilisateur dont on affiche le profile
 * - isEditable : détermine si oui ou nom l'utilisateur peut modifier le profil,
 *                le profil est modifiable que son propriétaire

 */
type ProfileUserInfoProps = {
  user: User;
  isEditable: boolean;
};

/**
 * Affiche les informations personnelles de l'utilisateur dans le profil
 * @param {ProfileUserInfoProps} param0 - Propriétés du ProfileUserInfos
 */
export default function ProfileUserInfo({
  user,
  isEditable,
}: ProfileUserInfoProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-start gap-5 px-7 py-4",
        "rounded-sm border border-gray-300 bg-white"
      )}
    >
      <div className={clsx("flex w-full flex-col items-start gap-2")}>
        <h3 className={clsx("font-medium text-black")}>
          Informations personnelles
        </h3>
        <div className="w-full border-b border-gray-300"></div>
      </div>

      <div className={clsx("grid grid-cols-1 gap-x-28 gap-y-6 md:grid-cols-3")}>
        <div className={clsx("flex flex-col")}>
          <span className={clsx("flex justify-start", "text-sm text-gray-500")}>
            Prénom
          </span>
          <span
            className={clsx(
              "flex justify-start",
              "text-sm font-medium text-black"
            )}
          >
            {user.firstName ? user.firstName : "NaN"}
          </span>
        </div>

        <div className={clsx("flex flex-col")}>
          <span className={clsx("flex justify-start", "text-sm text-gray-500")}>
            Nom
          </span>
          <span
            className={clsx(
              "flex justify-start",
              "text-sm font-medium text-black"
            )}
          >
            {user.lastName ? user.lastName : "NaN"}
          </span>
        </div>

        <div className={clsx("flex flex-col")}>
          <span className={clsx("flex justify-start", "text-sm text-gray-500")}>
            Username
          </span>
          <span
            className={clsx(
              "flex justify-start",
              "text-sm font-medium text-black"
            )}
          >
            {user.userName}
          </span>
        </div>

        <div className={clsx("flex flex-col")}>
          <span className={clsx("flex justify-start", "text-sm text-gray-500")}>
            Email
          </span>
          <span
            className={clsx(
              "flex justify-start",
              "text-sm font-medium text-black"
            )}
          >
            {user.email}
          </span>
        </div>

        <div className={clsx("flex flex-col")}>
          <span className={clsx("flex justify-start", "text-sm text-gray-500")}>
            Téléphone
          </span>
          <span
            className={clsx(
              "flex justify-start",
              "text-sm font-medium text-black"
            )}
          >
            {user.phoneNumber ? user.phoneNumber : "NaN"}
          </span>
        </div>

        <div className={clsx("flex flex-col")}>
          <span className={clsx("flex justify-start", "text-sm text-gray-500")}>
            Profession
          </span>
          <span
            className={clsx(
              "flex justify-start",
              "text-sm font-medium text-black"
            )}
          >
            {user.profession ? user.profession : "NaN"}
          </span>
        </div>

        <div className={clsx("flex flex-col")}>
          <span className={clsx("flex justify-start", "text-sm text-gray-500")}>
            Dernière connexion
          </span>
          <span
            className={clsx(
              "flex justify-start",
              "text-sm font-medium text-black"
            )}
          >
            {user.lastLoginAt
              ? new Date(user.lastLoginAt).toLocaleDateString()
              : "NaN"}
          </span>
        </div>

        <div className={clsx("flex flex-col")}>
          <span className={clsx("flex justify-start", "text-sm text-gray-500")}>
            Inscrit depuis
          </span>
          <span
            className={clsx(
              "flex justify-start",
              "text-sm font-medium text-black"
            )}
          >
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "NaN"}
          </span>
        </div>
      </div>
    </div>
  );
}
