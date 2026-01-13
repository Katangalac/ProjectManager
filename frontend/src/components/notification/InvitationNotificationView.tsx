import { useInvitationById } from "@/hooks/queries/invitation/useInvitationById";
import { useReplyToInvitation } from "@/hooks/mutations/invitation/useReplyToInvitation";
import { clsx } from "clsx";
import UserBasicInfo from "../profile/UserBasicInfo";
import { ProgressSpinner } from "primereact/progressspinner";
import UserErrorMessage from "../commons/UserErrorMessage";
import NoItems from "../commons/NoItems";
import { toast } from "sonner";
import { toastStyle } from "@/utils/toastStyle";

type InvitationNotificationViewProps = {
  invitationId: string;
  notificationType: string;
};

/**Affiche les notification de type INVITATION */
export default function InvitationNotificationView({
  invitationId,
  notificationType,
}: InvitationNotificationViewProps) {
  const { data, isError, isLoading } = useInvitationById(invitationId);
  const { replyToInvitation } = useReplyToInvitation();
  const handleReply = async (reply: boolean) => {
    if (data?.data.status === "PENDING") {
      await replyToInvitation({ invitationId, reply });
      toast.info("Your reply has been successfully sent.", {
        style: toastStyle["soft-success"],
        duration: 5000,
      });
    } else {
      toast.info("You've already replied to this invitation.", {
        style: toastStyle["soft-info"],
        duration: 10000,
      });
    }
  };
  return (
    <div>
      {isLoading && <ProgressSpinner />}

      {!isLoading && (
        <>
          {isError && <UserErrorMessage />}
          {data ? (
            <div className={clsx("flex flex-col gap-2 text-xs")}>
              {notificationType === "NEW_INVITATION" && (
                <div className={clsx("flex flex-col gap-2 p-4")}>
                  <span className={clsx("text-left")}>
                    <strong>{data.data.sender!.userName}</strong> sent you an
                    invitation to join the team{" "}
                    <strong>"{data.data.team!.name}"</strong>
                  </span>
                  <span className={clsx("flex items-center gap-2 text-left")}>
                    from:
                    <UserBasicInfo user={data.data.sender!} />
                  </span>
                  <span className="text-left">{data.data.message}</span>
                  <div className={clsx("flex items-center gap-4")}>
                    <button
                      onClick={() => handleReply(true)}
                      className={clsx(
                        "rounded-sm px-2 py-1 text-white",
                        "border border-gray-300 bg-gray-700",
                        "hover:bg-gray-800"
                      )}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReply(false)}
                      className={clsx(
                        "rounded-sm border border-gray-300 bg-gray-100 px-2 py-1",
                        "hover:bg-gray-200"
                      )}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
              {notificationType === "INVITATION_UPDATED" && (
                <div className={clsx("flex flex-col gap-2 p-4")}>
                  <span className="text-left">
                    <strong>{data.data.receiver!.userName}</strong> replies to
                    your invitation to join the team{" "}
                    <strong>"{data.data.team!.name}"</strong>
                  </span>
                  <span className="text-left">
                    <strong>{data.data.receiver!.userName}</strong>{" "}
                    {data.data.status === "ACCEPTED" ? "accepted" : "refused"}{" "}
                    to join the team <strong>"{data.data.team!.name}"</strong>
                  </span>
                </div>
              )}
            </div>
          ) : (
            <NoItems message="Invitation not found!" />
          )}
        </>
      )}
    </div>
  );
}
