import UserCircleIcon from "@heroicons/react/24/solid/UserCircleIcon";
import { cn } from "@/lib/utils";

type UserProfilePhotoProps = {
  imageUrl: string | null;
  username: string;
  email: string;
  size?: string;
  imageClassName?: string;
  className?: string;
};

export default function UserProfilePhoto({
  imageUrl,
  username,
  email,
  className,
  imageClassName,
  size = "h-5 w-5 min-w-5 min-h-5 size-2",
}: UserProfilePhotoProps) {
  return (
    <div
      className={cn(
        "flex h-fit max-h-fit w-fit max-w-fit items-center justify-center gap-1",
        "rounded-full",
        "text-gray-500",
        "dark:text-gray-400",
        className
      )}
    >
      {/**Image de profil de l'utilisateur */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={username + "/" + email}
          title={username + "/" + email}
          className={cn(
            "rounded-full border border-gray-400 bg-gray-200 object-cover object-center",
            size,
            "dark:border-gray-700",
            imageClassName
          )}
        />
      ) : (
        <UserCircleIcon className={cn(size, imageClassName)} />
      )}
    </div>
  );
}
