import { MessageWithRelation } from "@/types/Message";
import { cn } from "@/lib/utils";
import UserProfilePhoto from "../profile/UserProfilePhoto";
import { clsx } from "clsx";

/**
 * Propriéts du MessageCard
 *  - message : le message qu'on veut afficher
 *  - className : le style de la carte du message
 *  - currentUserMessagesStyle : le style de la carte d'un message de l'utilisateur courant
 *  - isCurrentUserMessage : détermine si un message provient de l'utilisateur courant
 */
type MessageCardProps = {
  message: MessageWithRelation;
  className?: string;
  currentUserMessagesStyle?: string;
  isCurrentUserMessage: boolean;
};

/**
 * Affcihe un message
 *
 * @param {MessageCardProps} param0 - Propriéts du MessageCard
 */
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
        <div
          className={clsx(
            "flex items-end gap-1",
            isCurrentUserMessage ? "justify-end" : "justify-start"
          )}
        >
          {!isCurrentUserMessage && (
            <UserProfilePhoto
              userId={message.sender!.id}
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
              userId={message.sender!.id}
              email={message.sender!.email}
              username={message.sender!.userName}
              imageUrl={message.sender!.imageUrl}
              imageClassName="min-h-8 min-w-8 text-sm"
              imagefallback={
                message.sender!.firstName && message.sender!.lastName
                  ? `${message.sender!.firstName[0].toUpperCase() + message.sender!.lastName[0].toUpperCase()}`
                  : undefined
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
