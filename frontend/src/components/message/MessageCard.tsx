import { MessageWithRelation } from "@/types/Message";
import { cn } from "@/lib/utils";
import UserProfilePhoto from "../profile/UserProfilePhoto";
import { clsx } from "clsx";

type MessageCardProps = {
  message: MessageWithRelation;
  className?: string;
  currentUserMessagesStyle?: string;
  isCurrentUserMessage: boolean;
};

export default function MessageCard({
  message,
  className,
  currentUserMessagesStyle,
  isCurrentUserMessage,
}: MessageCardProps) {
  return (
    <div className={cn("flex items-center justify-start gap-1", className)}>
      {/**Message Infos */}
      <div className={clsx("flex flex-col gap-1 text-xs")}>
        <div
          className={clsx(
            "flex gap-1",
            isCurrentUserMessage ? "justify-end pr-10" : "justify-start pl-10"
          )}
        >
          {isCurrentUserMessage ? (
            <span className={clsx("font-medium text-sky-600")}>You</span>
          ) : (
            <>
              {message.sender!.firstName && message.sender!.lastName ? (
                <span className={clsx("font-medium text-gray-600")}>
                  {message.sender!.firstName} {message.sender!.firstName}
                </span>
              ) : (
                <span className={clsx("font-medium text-gray-600")}>
                  {message.sender!.userName}
                </span>
              )}
            </>
          )}
          <span className={clsx("font-medium text-gray-600")}>
            {new Date(message.createdAt).toISOString().split("T")[0]}{" "}
            {new Date(message.createdAt).toISOString().split("T")[1]}
          </span>
        </div>

        {/**Message wrapper */}
        <div className="flex items-end justify-end gap-1">
          {!isCurrentUserMessage && (
            <UserProfilePhoto
              email={message.sender!.email}
              username={message.sender!.userName}
              imageUrl={message.sender!.imageUrl}
              imageClassName="min-h-8 min-w-8"
            />
          )}
          <div
            className={cn(
              "max-w-70 rounded-md p-2 text-left text-wrap shadow-md",
              isCurrentUserMessage
                ? "rounded-br-none bg-sky-200"
                : "rounded-bl-none bg-gray-100",
              currentUserMessagesStyle
            )}
          >
            {message.content}
          </div>
          {isCurrentUserMessage && (
            <UserProfilePhoto
              email={message.sender!.email}
              username={message.sender!.userName}
              imageUrl={message.sender!.imageUrl}
              imageClassName="min-h-8 min-w-8"
            />
          )}
        </div>
      </div>
    </div>
  );
}
