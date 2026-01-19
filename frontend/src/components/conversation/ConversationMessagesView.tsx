import { clsx } from "clsx";
import MessageList from "../message/MessagesList";
import { useConversationMessages } from "@/hooks/queries/conversation/useConversationMessages";
import { ProgressSpinner } from "primereact/progressspinner";
import { useCallback, useMemo } from "react";
import { MessageWithRelation } from "@/types/Message";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/hooks/socket/useSocket";

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
  const params = useMemo(() => ({ all: true }), []);

  const { data, isLoading, isError } = useConversationMessages(
    conversationId,
    params
  );

  const queryClient = useQueryClient();

  //Ajoute le nouveau message entrant directement dans la liste des messages de la conversation
  const handleNewMessage = useCallback(
    (message: MessageWithRelation) => {
      if (message.conversationId !== conversationId) return;

      queryClient.setQueryData<MessageWithRelation[]>(
        ["conversationMessages", conversationId, params],
        (old) => {
          if (!old) return [message];
          if (old.some((m) => m.id === message.id)) return old;
          return [...old, message];
        }
      );
    },
    [conversationId, params, queryClient]
  );

  useSocket("new_message", handleNewMessage);

  return (
    <div className={clsx("flex h-full w-full flex-1 flex-col")}>
      {isLoading && (
        <ProgressSpinner className="sm:h-10 lg:h-15" strokeWidth="4" />
      )}
      {isError && (
        <div>An error occcur while loading conversation messages</div>
      )}
      {!isLoading && !isError && (
        <MessageList
          messages={data?.data ?? []}
          conversationId={conversationId}
        />
      )}
    </div>
  );
}
