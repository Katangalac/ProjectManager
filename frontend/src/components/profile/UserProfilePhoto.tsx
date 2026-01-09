import { cn } from "@/lib/utils";
import { CircleIcon } from "@phosphor-icons/react";
import { useUserStatus } from "@/hooks/queries/user/useUserStatus";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { stringToColor } from "@/utils/stringUtils";
import { colors } from "@/lib/constants/color";
import { useMemo } from "react";
import clsx from "clsx";

/**
 *
 */
type UserProfilePhotoProps = {
  userId: string;
  imageUrl: string | null;
  username: string;
  email: string;
  size?: string;
  imageClassName?: string;
  className?: string;
  isOnline?: boolean;
  showOnlineStatus?: boolean;
  imagefallback?: string;
};

/**
 *
 * @param param0
 * @returns
 */
export default function UserProfilePhoto({
  userId,
  imageUrl,
  username,
  email,
  className,
  imageClassName,
  size = "h-5 w-5 min-w-5 min-h-5 size-2",
  imagefallback,
  showOnlineStatus = false,
}: UserProfilePhotoProps) {
  const { isOnline } = useUserStatus(userId);
  const fallback =
    username.length > 2
      ? username[0].toUpperCase() + username[1].toUpperCase()
      : username[0].toUpperCase();
  const bgColor = useMemo(() => {
    return stringToColor(userId, colors);
  }, [userId]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "relative flex h-fit max-h-fit w-fit max-w-fit cursor-default items-center justify-center gap-1",
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
              className={cn(
                "rounded-full border border-gray-400 bg-gray-200 object-cover object-center",
                size,
                "dark:border-gray-700",
                imageClassName
              )}
            />
          ) : (
            <div
              className={cn(
                size,
                "flex items-center justify-center rounded-full text-center text-lg font-bold text-white",
                imageClassName
              )}
              style={{ backgroundColor: bgColor }}
            >
              {imagefallback ? imagefallback : fallback}
            </div>
          )}
          {showOnlineStatus && (
            <div
              className={clsx(
                "absolute right-0 bottom-1 ring-2 ring-white",
                "size-2 rounded-full",
                isOnline?.valueOf() && "bg-green-500",
                !isOnline?.valueOf() && "bg-gray-400"
              )}
            ></div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>{username}</TooltipContent>
    </Tooltip>
  );
}
