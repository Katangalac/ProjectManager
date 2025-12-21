import { clsx } from "clsx";
import UserCircleIcon from "@heroicons/react/24/solid/UserCircleIcon";
import { User } from "../../types/User";
import { FileUploaderRegular, defineLocale } from "@uploadcare/react-uploader";
import { useState, useEffect } from "react";
import { useUserStore } from "../../stores/userStore";
import { updateUser } from "../../services/user.services";
import "@uploadcare/react-uploader/core.css";
import fr from "@uploadcare/file-uploader/locales/file-uploader/fr.js";
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";

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
 * Affiche l'image de profil, le nom, le prénom, la profession et l'email
 * Permet la modification de l'image de profil si l'utilisateur est le propriétaire du profil
 *
 * @param {ProfileHeaderProps} param0 - Propriétés du ProfileHeader
 */
export default function ProfileHeader({
  user,
  isEditable,
}: ProfileHeaderProps) {
  const { setUser } = useUserStore();
  const uploadcarePubKey = import.meta.env.VITE_UPLOAD_CARE_PUBLIC_KEY;

  /**
   * Configuration de la locale française pour l'uploadeur de fichiers
   */
  useEffect(() => {
    defineLocale("fr", fr);
  }, []);

  const [imageUrl, setImageUrl] = useState<string | null>(
    user.imageUrl ?? null
  );
  const [saving, setSaving] = useState(false);
  if (saving) console.log("Saving image...");

  /**
   * Fonction appelée lors du changement de l'image de profil
   * Met à jour l'image de profil de l'utilisateur et l'état global de l'utilisateur
   * En cas d'erreur, rétablit l'ancienne image de profil
   *
   * @param {string} url - URL de la nouvelle image de profil
   */
  const handleImageChange = async (url: string) => {
    if (url === undefined) return;
    setImageUrl(url);
    setSaving(true);
    try {
      const saved = await updateUser({ imageUrl: url });
      setUser(saved.data);
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de l'image de profil :",
        error
      );
      setImageUrl(user.imageUrl ?? null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={clsx(
        "flex items-center justify-between gap-4 px-6 py-2",
        "rounded-sm border border-gray-300",
        "dark:border-gray-500"
      )}
    >
      <div className={clsx("flex items-center gap-4")}>
        <div
          className={clsx(
            "relative flex h-fit max-h-fit w-fit max-w-fit items-center justify-center",
            "rounded-full",
            "text-gray-500",
            "dark:text-gray-400"
          )}
        >
          {/**Image de profil de l'utilisateur */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={user.userName}
              onError={() => setImageUrl(null)}
              className={clsx(
                "h-20 w-20 rounded-full border border-gray-300 bg-gray-200 object-cover object-center"
              )}
            />
          ) : (
            <UserCircleIcon className={clsx("size-20")} />
          )}

          {/**Uploader de fichier pour changer l'image de profil */}
          {isEditable && (
            <div title="Upload a photo">
              <FileUploaderRegular
                sourceList="local, camera, facebook, gdrive"
                cameraModes="photo"
                pubkey={uploadcarePubKey}
                multiple={false}
                iconHrefResolver={(iconName) => {
                  if (iconName === "upload") return "/icons/camera.svg";
                  if (iconName === "facebook") return "/icons/facebook.svg";
                  if (iconName === "gdrive") return "/icons/google-drive.svg";
                  if (iconName === "camera") return "/icons/camera-light.svg";
                  if (iconName === "local") return "/icons/folder.svg";
                  if (iconName === "default") return "/icons/arrow-down.svg";
                  return "";
                }}
                onFileUploadSuccess={(file) => {
                  const url = file?.cdnUrl;
                  handleImageChange(url);
                }}
                className="absolute -right-1 bottom-2"
              />
            </div>
          )}
        </div>

        <div className={clsx("flex flex-col")}>
          {/**Nom et prénom de l'utilisateur ou UserName*/}
          <div className={clsx("flex gap-2")}>
            {user.firstName && (
              <span
                className={clsx(
                  "text-sm font-medium text-black",
                  "dark:text-white"
                )}
              >
                {user.firstName}
              </span>
            )}
            {user.lastName && (
              <span
                className={clsx(
                  "text-sm font-medium text-black",
                  "dark:text-white"
                )}
              >
                {user.lastName}
              </span>
            )}
            {!user.firstName && !user.lastName && (
              <span
                className={clsx(
                  "text-sm font-medium text-black",
                  "dark:text-white"
                )}
              >
                {user.userName}
              </span>
            )}
          </div>

          {/**Profession et email de l'utilisateur */}
          <div className={clsx("flex flex-col items-start")}>
            {user.profession && (
              <span
                className={clsx("text-sm text-gray-500", "dark:text-gray-400")}
              >
                {user.profession}
              </span>
            )}
            <span
              className={clsx("text-sm text-gray-500", "dark:text-gray-400")}
            >
              {user.email}
            </span>
          </div>
        </div>
      </div>
      <div className={clsx("flex h-16 items-start")}>
        {isEditable && (
          <button
            className={clsx(
              "flex items-center justify-between gap-3 px-2 py-1",
              "rounded-sm bg-sky-600 hover:bg-sky-700",
              "text-sm font-medium text-white",
              "dark:bg-sky-800 dark:hover:bg-sky-700",
              "dark:text-white"
            )}
          >
            <span>Change password</span>
            <PencilSquareIcon className={clsx("size-3.5")} />
          </button>
        )}
      </div>
    </div>
  );
}
