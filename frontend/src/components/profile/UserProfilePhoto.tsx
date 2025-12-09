import { clsx } from "clsx";
import UserCircleIcon from "@heroicons/react/24/solid/UserCircleIcon";

type UserProfilePhotoProps = {
  imageUrl: string | null;
  username: string;
  email: string;
  size?: string;
};

export default function UserProfilePhoto({
  imageUrl,
  username,
  email,
  size = "h-5 w-5 size-2",
}: UserProfilePhotoProps) {
  return (
    <div
      className={clsx(
        "flex h-fit max-h-fit w-fit max-w-fit items-center justify-center gap-1",
        "rounded-full",
        "text-gray-500",
        "dark:text-gray-400"
      )}
    >
      {/**Image de profil de l'utilisateur */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={username + "/" + email}
          title={username + "/" + email}
          className={clsx(
            "rounded-full border border-gray-400 bg-gray-200 object-cover object-center",
            size,
            "dark:border-gray-700"
          )}
        />
      ) : (
        <UserCircleIcon className={clsx(size)} />
      )}
    </div>
  );
}
