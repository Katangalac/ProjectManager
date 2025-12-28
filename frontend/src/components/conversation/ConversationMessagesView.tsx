import { clsx } from "clsx";
import MessageList from "../message/MessagesList";
import { useConversationMessages } from "@/hooks/queries/conversation/useConversationMessages";
import { ProgressSpinner } from "primereact/progressspinner";

/**
 * Propriétés du ConversationMessages
 *  - conversationId : identifiant de la conversation
 */
type ConversationMessagesProps = {
  conversationId: string;
};

/**
 * Affiche les messages d'une conversations
 * @param {ConversationMessagesProps} param0 - u ConversationMessages
 */
export default function ConversationMessages({
  conversationId,
}: ConversationMessagesProps) {
  const {
    data = [],
    isLoading,
    isError,
  } = useConversationMessages(conversationId, { all: true });
  return (
    <div className={clsx("h-full w-full")}>
      {isLoading && <ProgressSpinner />}
      {isError && (
        <div>An error occcur while loading conversation messages</div>
      )}
      {!isLoading && !isError && (
        <MessageList messages={data} conversationId={conversationId} />
      )}
    </div>
  );
}
