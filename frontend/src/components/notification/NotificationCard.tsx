import { Notification } from "@/types/Notification";
import { formatShortDateWithOptionalYear, formatTime } from "@/utils/dateUtils";
import { clsx } from "clsx";
import { cn } from "@/lib/utils";
import { CheckCheck } from "lucide-react";
import { getNotificationTitle } from "@/utils/stringUtils";
import { useNavigate } from "react-router-dom";

/**
 * Propriétés du NotificationCard
 *
 *  - notification : la notification à afficher
 *  - onCLick : fonction appelée lors d'un click sur la carte
 */
type NotificationCardProps = {
  notification: Notification;
  onClick?: () => void;
  className?: string;
};

/**
 * Affiche une notification dans une carte
 *
 * @param {NotificationCardProps} param0 - propriétés du NotificationCard
 */
export default function NotificationCard({
  notification,
  onClick,
  className,
}: NotificationCardProps) {
  const titleData = getNotificationTitle(notification.title);
  const navigate = useNavigate();
  const onClickFunction =
    onClick !== undefined ? onClick : () => navigate(`/notifications`);
  return (
    <div
      className={cn(
        "flex cursor-pointer flex-col gap-2 p-2",
        "hover:bg-gray-100",
        "rounded-sm border border-gray-300",
        className
      )}
      onClick={onClickFunction}
    >
      <span
        className={clsx(
          "line-clamp-2 text-left text-xs font-medium text-gray-800"
        )}
      >
        {titleData.title}
      </span>
      <span className={clsx("line-clamp-3 text-left text-xs text-gray-700")}>
        {notification.message}
      </span>

      <div className={clsx("flex w-full items-center justify-between")}>
        <span className={clsx("text-xs text-gray-400")}>
          {formatShortDateWithOptionalYear(new Date(notification.createdAt))}{" "}
          {formatTime(new Date(notification.createdAt), true)}
        </span>
        <CheckCheck
          className={clsx(
            "size-4",
            notification.read ? "text-sky-500" : "text-gray-400"
          )}
        />
      </div>
    </div>
  );
}
