import { useUserNotifications } from "@/hooks/queries/user/useUserNotifications";
import { clsx } from "clsx";
import NoItems from "../commons/NoItems";
import UserErrorMessage from "../commons/UserErrorMessage";
import { ProgressSpinner } from "primereact/progressspinner";

export default function NotificationsShortList() {
  const { data, isLoading, isError, refetch } = useUserNotifications({
    all: true,
  });
  return (
    <div
      className={clsx(
        "flex max-h-[300px] min-h-60 w-full flex-col gap-2 overflow-y-auto",
        "[&::-webkit-scrollbar]:w-0"
      )}
    >
      {isLoading && <ProgressSpinner />}
      {!isLoading && (
        <>
          {isError && <UserErrorMessage onRetryButtonClick={refetch} />}
          {data && (
            <>
              {data.data.length > 0 ? (
                <>
                  {data.data.map((notif) => (
                    <div
                      className={clsx(
                        "flex cursor-pointer flex-col gap-2 p-2",
                        "hover:bg-gray-100",
                        "rounded-sm border border-gray-300"
                      )}
                    >
                      <span
                        className={clsx(
                          "line-clamp-1 text-left text-xs font-medium text-gray-800"
                        )}
                      >
                        {notif.title}
                      </span>
                      <span
                        className={clsx(
                          "line-clamp-3 text-left text-xs text-gray-700"
                        )}
                      >
                        {notif.message}
                      </span>
                    </div>
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
