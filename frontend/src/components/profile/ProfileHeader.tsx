import { clsx } from "clsx";
import UserCircleIcon from "@heroicons/react/24/solid/UserCircleIcon";
import { User } from "../../types/User";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import { useState } from "react";
import { useUserStore } from "../../stores/userStore";
import { updateUser } from "../../services/user.services";
import "@uploadcare/react-uploader/core.css";

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
  const { setUser } = useUserStore();
  const uploadcarePubKey = import.meta.env.VITE_UPLOAD_CARE_PUBLIC_KEY;
  const [imageUrl, setImageUrl] = useState<string | null>(
    user.imageUrl ?? null
  );
  const [saving, setSaving] = useState(false);
  if (saving) console.log("Saving image...");
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
        "flex items-center gap-4 px-6 py-2",
        "rounded-sm border border-gray-300",
        "dark:border-gray-500"
      )}
    >
      <div
        className={clsx(
          "relative flex h-fit max-h-fit w-fit max-w-fit items-center justify-center",
          "rounded-full",
          "text-gray-500",
          "dark:text-gray-400"
        )}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={user.userName}
            onError={() => setImageUrl(null)}
            className={clsx(
              "h-20 w-20 rounded-full border bg-gray-200 object-cover object-center"
            )}
          />
        ) : (
          <UserCircleIcon className={clsx("size-20")} />
        )}
        {isEditable && (
          <div title="Téléverser une photo">
            <FileUploaderRegular
              sourceList="local, camera, facebook, gdrive"
              cameraModes="photo"
              pubkey={uploadcarePubKey}
              multiple={false}
              localeName="fr"
              localeDefinitionOverride={{
                fr: {
                  "locale-id": "fr",
                  "social-source-lang": "fr",
                  "upload-file": "Modifier",
                  file__one: "fichier",
                  file__other: "fichiers",
                  "header-uploading":
                    "Chargement {{count}} {{plural:fichier(count)}}",
                },
              }}
              iconHrefResolver={(iconName) => {
                if (iconName === "upload") return "/icons/camera.svg";
                if (iconName === "facebook") return "/icons/facebook.svg";
                if (iconName === "gdrive") return "/icons/google-drive.svg";
                if (iconName === "camera") return "/icons/camera-light.svg";
                if (iconName === "local") return "/icons/folder.svg";
                if (iconName === "default") return "/icons/arrow-down.svg";
                return "";
              }}
              className="absolute -right-1 bottom-2"
              onFileUploadSuccess={(file) => {
                const url = file?.cdnUrl;
                console.log("upload-success: ", url);
                handleImageChange(url);
              }}
            />
          </div>
        )}
      </div>

      <div className={clsx("flex flex-col")}>
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
          {!user.firstName && (
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

        <div className={clsx("flex flex-col items-start")}>
          {user.profession && (
            <span
              className={clsx("text-sm text-gray-500", "dark:text-gray-400")}
            >
              {user.profession}
            </span>
          )}
          <span className={clsx("text-sm text-gray-500", "dark:text-gray-400")}>
            {user.email}
          </span>
        </div>
      </div>
    </div>
  );
}
