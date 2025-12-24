import { MessageWithRelation } from "@/types/Message";
import MessageCard from "./MessageCard";
import { useUserStore } from "@/stores/userStore";
import clsx from "clsx";

type MessageListProps = {
  messages: MessageWithRelation[];
};

export default function MessageList({ messages }: MessageListProps) {
  const { user } = useUserStore();
  return (
    <div className={clsx("flex w-full flex-col gap-8")}>
      {messages.map((message) => (
        <div
          className={clsx(
            "flex w-full",
            user?.id === message.sender!.id ? "justify-end" : "justify-start"
          )}
        >
          <MessageCard
            message={message}
            isCurrentUserMessage={user?.id === message.sender!.id}
          />
        </div>
      ))}
    </div>
  );
}
