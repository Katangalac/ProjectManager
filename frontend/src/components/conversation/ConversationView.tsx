import { cn } from "@/lib/utils";
import { ConversationWithRelation } from "@/types/Conversation";
import UserProfilePhoto from "../profile/UserProfilePhoto";
import clsx from "clsx";
import { timeAgo } from "@/utils/dateUtils";
import { useUserStore } from "@/stores/userStore";

/**
 * Propriétés du ConversationCard
 *  - conversation : la conversation à afficher dans la carte
 *  - className : style de la carte
 */
type ConversationCardProps = {
  conversation: ConversationWithRelation;
  className?: string;
};

/**
 * Affiche une conversation dans une carte
 *
 * @param {ConversationCardProps} param0 - Propriétés du ConversationCard
 */
export default function ConversationCard({
  conversation,
  className,
}: ConversationCardProps) {
  const { user } = useUserStore();
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center rounded-sm bg-sky-100 p-2 text-xs",
        className
      )}
    >
      {conversation.messages && (
        <div className="flex w-full flex-col gap-3">
          {conversation.messages[0] && conversation.messages[0].sender && (
            <div className={clsx("flex w-full justify-between")}>
              <div className={clsx("flex items-center justify-start gap-2")}>
                <UserProfilePhoto
                  email={conversation.messages[0].sender.email}
                  username={conversation.messages[0].sender.userName}
                  imageUrl={conversation.messages[0].sender.imageUrl}
                  imageClassName="min-h-8 min-w-8"
                />
                {user?.id === conversation.messages[0].sender.id ? (
                  <span className={clsx("font-bold text-sky-600")}>You</span>
                ) : (
                  <div
                    className={clsx("flex flex-col items-start justify-start")}
                  >
                    {conversation.messages[0].sender.firstName &&
                    conversation.messages[0].sender.lastName ? (
                      <span className={clsx("font-medium text-black")}>
                        {conversation.messages[0].sender.firstName}{" "}
                        {conversation.messages[0].sender.firstName}
                      </span>
                    ) : (
                      <span className={clsx("font-medium text-black")}>
                        {conversation.messages[0].sender.userName}
                      </span>
                    )}
                    {conversation.messages[0].sender.profession && (
                      <span className={clsx("font-medium text-gray-600")}>
                        {conversation.messages[0].sender.profession}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <span className={clsx("text-gray-600")}>
                {timeAgo(new Date(conversation.messages[0].createdAt), true)}
              </span>
            </div>
          )}
          {conversation.messages[0] && (
            <span
              className={clsx("line-clamp-2 text-left text-wrap text-gray-700")}
            >
              {conversation.messages[0].content}
            </span>
          )}
          {!conversation.messages[0] && (
            <span className={clsx("text-gray-600")}>Untitled</span>
          )}
        </div>
      )}
      {!conversation.messages && (
        <span className={clsx("text-gray-600")}>Untitled</span>
      )}
    </div>
  );
}
