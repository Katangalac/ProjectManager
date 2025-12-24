import { clsx } from "clsx";
import MessageList from "../message/MessagesList";
import { useConversationMessages } from "@/hooks/queries/conversation/useConversationMessages";
import { ProgressSpinner } from "primereact/progressspinner";

type ConversationMessagesProps = {
  conversationId: string;
};

export default function ConversationMessages({
  conversationId,
}: ConversationMessagesProps) {
  const {
    data = [],
    isLoading,
    isError,
  } = useConversationMessages(conversationId, { all: true });
  console.log("CONVERSATION-MESSAGE : ", data);
  return (
    <div className={clsx("w-full")}>
      {isLoading && <ProgressSpinner />}
      {isError && (
        <div>An error occcur while loading conversation messages</div>
      )}
      {!isLoading && !isError && <MessageList messages={data} />}
    </div>
  );
}
