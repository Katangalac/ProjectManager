import { useUserNotifications } from "@/hooks/queries/user/useUserNotifications";
import { clsx } from "clsx";
import NoItems from "../commons/NoItems";
import UserErrorMessage from "../commons/UserErrorMessage";
import { ProgressSpinner } from "primereact/progressspinner";
import NotificationCard from "./NotificationCard";

/**
 * Affiche les invitations dans une liste courte
 * Utilisé dans le header
 */
export default function NotificationsShortList() {
  const { data, isLoading, isError, refetch } = useUserNotifications({
    all: true,
  });
  return (
    <div
      className={clsx(
        "flex max-h-[300px] min-h-60 flex-col gap-2 overflow-y-auto sm:w-full md:w-[350px]",
        "[&::-webkit-scrollbar]:w-0",
        (isLoading || !(data && data.data.length > 0)) &&
          "items-center justify-center"
      )}
    >
      {isLoading && (
        <ProgressSpinner className="h-15 sm:h-10" strokeWidth="4" />
      )}
      {!isLoading && (
        <>
          {isError && <UserErrorMessage onRetryButtonClick={refetch} />}
          {data && (
            <>
              {data.data.length > 0 ? (
                <>
                  {data.data.map((notif) => (
                    <NotificationCard notification={notif} />
                  ))}
                </>
              ) : (
                <NoItems message="No notifications yet" />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
