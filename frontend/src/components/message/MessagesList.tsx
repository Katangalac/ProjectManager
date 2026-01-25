import { MessageWithRelation } from "@/types/Message";
import MessageCard from "./MessageCard";
import { getUserStore } from "@/stores/getUserStore";
import { useCreateMessage } from "@/hooks/mutations/message/useCreateMessage";
import clsx from "clsx";
import { useState } from "react";
import { CreateMessageData } from "@/types/Message";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react";

/**
 * Proprités du MessageList
 *  - messages : la liste des messages à afficher
 *  - conversationId : l'identifiant de la conversation dont font parties les messages
 */
type MessageListProps = {
  messages: MessageWithRelation[];
  conversationId: string;
};

/**
 * Affiche les messages d'une conversation
 *
 * @param {MessageListProps} param0 - Proprités du MessageList
 */
export default function MessageList({
  messages,
  conversationId,
}: MessageListProps) {
  const { user } = getUserStore();
  const [message, setMessage] = useState<string>("");
  const { createMessage, isCreating, error } = useCreateMessage();

  const handleSendMessageClick = () => {
    const messageData: CreateMessageData = {
      conversationId: conversationId,
      senderId: user!.id,
      content: message,
    };
    createMessage(messageData);
    setMessage("");
  };

  return (
    <div className={clsx("flex h-full w-full flex-col")}>
      <div className="flex min-h-0 flex-3 flex-col gap-1 overflow-hidden">
        {isCreating && (
          <span className="text-left text-sm">Sending message...</span>
        )}
        {error && (
          <span className="text-left text-sm text-red-600">
            An error occur while sending message
          </span>
        )}
        <div
          className={clsx(
            "flex min-h-0 flex-col gap-8 overflow-y-auto px-4 pt-2 pb-2",
            "[&::-webkit-scrollbar]:w-1",
            "[&::-webkit-scrollbar-track]:bg-gray-300",
            "[&::-webkit-scrollbar-thumb]:bg-gray-400"
          )}
        >
          {messages.map((message) => (
            <div
              className={clsx(
                "flex w-full",
                user?.id === message.sender!.id
                  ? "justify-end"
                  : "justify-start"
              )}
            >
              <MessageCard
                message={message}
                isCurrentUserMessage={user?.id === message.sender!.id}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-1 gap-1 border-t border-gray-300 px-4 pt-2 pb-4 shadow-[0_-2px_6px_rgba(0,0,0,0.1)]">
        <div
          className={clsx(
            "flex h-full w-full flex-col items-center justify-start gap-2",
            "rounded-sm border border-gray-300 shadow-lg"
          )}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={1}
            className={clsx(
              "myText min-h-0 w-full flex-3 resize-none p-2",
              "rounded-sm border-none shadow-none",
              "text-sm text-black",
              "focus:ring-none focus-ring-0 focus:border-none focus:outline-none",
              "[&::-webkit-scrollbar]:w-0"
            )}
            placeholder="Write your message here..."
          />
          <div
            className={clsx(
              "flex min-h-0 w-full flex-1 items-center justify-end p-2"
            )}
          >
            <button
              className={clsx(
                "flex items-center justify-center gap-1 px-2 py-1",
                "rounded-sm bg-sky-500 hover:bg-sky-600",
                "text-sm font-medium text-white"
              )}
              onClick={handleSendMessageClick}
            >
              <PaperPlaneTiltIcon weight="fill" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
