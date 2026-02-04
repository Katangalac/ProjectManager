import { useUserNotifications } from "@/hooks/queries/user/useUserNotifications";
import { clsx } from "clsx";
import NoItems from "@/components/commons/NoItems";
import UserErrorMessage from "@/components/commons/UserErrorMessage";
import { ProgressSpinner } from "primereact/progressspinner";
import NotificationCard from "@/components/notification/NotificationCard";
import { Notification } from "@/types/Notification";
import { useState } from "react";
import { getNotificationTitle } from "@/utils/stringUtils";
import InvitationNotificationView from "@/components/notification/InvitationNotificationView";
import TaskNotificationView from "@/components/notification/TaskNotificationView";
import TeamNotificationView from "@/components/notification/TeamNotificationView";
import { useReadNotification } from "@/hooks/mutations/notification/useReadNotification";
import MotionPage from "@/components/commons/MotionPage";

export default function NotificationsPage() {
  const { data, isLoading, isError, refetch } = useUserNotifications({
    all: true,
  });
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { readNotification } = useReadNotification();
  const invitationNotifications = ["NEW_INVITATION", "INVITATION_UPDATED"];
  const taskNotifications = ["NEW_TASK", "UNASSIGN_TASK"];
  const teamNotifications = ["NEW_TEAM", "REMOVE_FROM_TEAM", "NEW_TEAM_ROLE"];
  const selectedNotifTitle = selectedNotification
    ? selectedNotification.title.split("-")?.[0]
    : "";
  const selectedNotifPayload = selectedNotification
    ? getNotificationTitle(selectedNotification.title).payload
    : "";

  const handleReadNotification = async (notification: Notification) => {
    try {
      if (!notification.read) {
        await readNotification(notification.id);
      }
    } catch (err: unknown) {
      console.error(err);
    }
  };

  return (
    <MotionPage>
      <div className={clsx("flex h-full flex-1")}>
        <div
          className={clsx(
            "flex h-full max-w-72 min-w-72 flex-col gap-4",
            "border-r border-gray-300",
            isLoading && "flex items-center justify-start py-5"
          )}
        >
          {isLoading && (
            <ProgressSpinner className="h-10 lg:h-10" strokeWidth="4" />
          )}
          {!isLoading && (
            <>
              {isError && <UserErrorMessage onRetryButtonClick={refetch} />}
              {data && (
                <>
                  {data.data.length > 0 ? (
                    <div
                      className={clsx(
                        "flex max-h-[calc(100%-10px)] flex-col",
                        "overflow-y-auto [&::-webkit-scrollbar]:w-0",
                        "[&::-webkit-scrollbar-track]:bg-neutral-300",
                        "[&::-webkit-scrollbar-thumb]:bg-neutral-400"
                      )}
                    >
                      {data.data.map((notif, index) => (
                        <NotificationCard
                          key={notif.id}
                          className={clsx(
                            "rounded-none border-0 border-b",
                            selectedIndex === index && "bg-sky-50"
                          )}
                          notification={notif}
                          onClick={() => {
                            setSelectedNotification(notif);
                            setSelectedIndex(index);
                            handleReadNotification(notif);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <NoItems message="No notifications available" />
                  )}
                </>
              )}
            </>
          )}
        </div>

        <div className={clsx("flex-1")}>
          {selectedNotification && (
            <>
              {invitationNotifications.includes(selectedNotifTitle) ? (
                <InvitationNotificationView
                  invitationId={selectedNotifPayload}
                  notificationType={selectedNotifTitle}
                />
              ) : (
                <>
                  {taskNotifications.includes(selectedNotifTitle) ? (
                    <TaskNotificationView
                      taskId={selectedNotifPayload}
                      notificationType={selectedNotifTitle}
                    />
                  ) : (
                    <>
                      {teamNotifications.includes(selectedNotifTitle) ? (
                        <TeamNotificationView
                          teamId={selectedNotifPayload}
                          notificationType={selectedNotifTitle}
                        />
                      ) : (
                        <div
                          className={clsx("flex flex-col gap-2 p-4 text-xs")}
                        >
                          <span className="text-left">
                            {selectedNotification.message}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </MotionPage>
  );
}
