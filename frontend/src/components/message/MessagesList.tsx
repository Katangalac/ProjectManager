import { MessageWithRelation } from "@/types/Message";
import MessageCard from "./MessageCard";
import { useUserStore } from "@/stores/userStore";
import { useCreateMessage } from "@/hooks/mutations/message/useCreateMessage";
import clsx from "clsx";
import { useState } from "react";
import { CreateMessageData } from "@/types/Message";

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
  const { user } = useUserStore();
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
    <div className={clsx("flex h-full w-full flex-col justify-between")}>
      <div className="flex w-full flex-col gap-1">
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
            "flex h-[500px] w-full flex-col gap-8 overflow-x-auto pr-2 pb-2",
            "[&::-webkit-scrollbar]:w-1",
            "[&::-webkit-scrollbar-track]:bg-gray-400",
            "[&::-webkit-scrollbar-thumb]:bg-gray-600"
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
      <div className="flex gap-1">
        <input
          type="text"
          title="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="tap here..."
          className="w-full rounded-md border border-gray-300 px-2 py-5"
        />
        <button
          className={clsx(
            "rounded-md bg-sky-600 px-2 py-3 text-white hover:bg-sky-700"
          )}
          onClick={handleSendMessageClick}
        >
          Send
        </button>
      </div>
    </div>
  );
}
