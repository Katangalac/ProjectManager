import { clsx } from "clsx";
import { useTeamConversations } from "@/hooks/queries/team/useTeamConversations";
import { ProgressSpinner } from "primereact/progressspinner";
import ConversationCard from "../conversation/ConversationView";
import ConversationMessages from "../conversation/ConversationMessagesView";
import { PlusIcon } from "@heroicons/react/24/outline";
import NoItems from "../commons/NoItems";
import UserErrorMessage from "../commons/UserErrorMessage";
import { useState } from "react";
import { ConversationWithRelation } from "@/types/Conversation";
import ConversationForm from "../conversation/ConversationForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageCirclePlus } from "lucide-react";

type TeamConversationsViewProps = {
  teamId: string;
};

/**
 * Affiche les conversations d'une équipe
 *
 * @param {TeamConversationsViewProps} param0 - propriétés du component
 */
export default function TeamConversationsView({
  teamId,
}: TeamConversationsViewProps) {
  const {
    data: conversations,
    isLoading,
    isError,
    refetch,
  } = useTeamConversations(teamId!, { all: true });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationWithRelation | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className={clsx("flex h-full")}>
      <div
        className={clsx(
          "flex h-full max-w-72 min-w-72 flex-col gap-4",
          "border-r border-gray-300",
          isLoading && "items-center justify-start py-5"
        )}
      >
        {isLoading && (
          <ProgressSpinner className="sm:h-10 lg:h-10" strokeWidth="4" />
        )}
        {!isLoading && (
          <>
            <div
              className={clsx(
                "flex max-h-[calc(100%-10px)] flex-col justify-start",
                "overflow-y-auto [&::-webkit-scrollbar]:w-0",
                "[&::-webkit-scrollbar-track]:bg-neutral-300",
                "[&::-webkit-scrollbar-thumb]:bg-neutral-400",
                (!conversations ||
                  conversations.data.length === 0 ||
                  isLoading) &&
                  "items-center justify-center"
              )}
            >
              <div
                className={clsx(
                  "flex w-full items-center justify-between p-2",
                  "border-b border-gray-300"
                )}
              >
                <span className={clsx("text-left text-sm font-medium")}>
                  Conversations
                </span>
                <button
                  className={clsx(
                    "flex cursor-pointer items-center justify-center p-1",
                    "rounded-sm border border-gray-300 hover:bg-gray-100",
                    "text-xs font-medium text-black"
                  )}
                  onClick={() => setShowDialog(true)}
                >
                  <PlusIcon className="size-2.5 stroke-3" /> New
                </button>
              </div>
              {conversations && (
                <>
                  {conversations.data.length > 0 ? (
                    <>
                      {conversations.data.map((conv, index) => (
                        <ConversationCard
                          key={index}
                          conversation={conv}
                          className={clsx(
                            "rounded-none border-0 border-b",
                            selectedIndex === index && "bg-sky-50"
                          )}
                          onClick={() => {
                            setSelectedConversation(conv);
                            setSelectedIndex(index);
                          }}
                        />
                      ))}
                    </>
                  ) : (
                    <NoItems
                      message="No conversations available"
                      className="mt-5"
                    />
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>

      <div
        className={clsx(
          "flex flex-1 flex-col",
          (!selectedConversation ||
            isError ||
            !conversations ||
            conversations.data.length === 0) &&
            "items-center justify-center"
        )}
      >
        {isError ? (
          <UserErrorMessage onRetryButtonClick={refetch} />
        ) : (
          <>
            {!isLoading &&
            (!conversations || conversations.data.length === 0) ? (
              <NoItems message="No conversations available" />
            ) : (
              <>
                {selectedConversation ? (
                  <>
                    <ConversationMessages
                      conversationId={selectedConversation.id}
                    />
                  </>
                ) : (
                  <NoItems message="No conversation selected" />
                )}
              </>
            )}
          </>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className={clsx(
            "max-w-[500px] p-0",
            "[&>button]:text-white",
            "[&>button]:hover:text-white"
          )}
        >
          <DialogHeader className={clsx("rounded-t-md bg-sky-500 px-4 py-4")}>
            <DialogTitle className="text-lg text-white">
              <span className="flex items-center gap-2">
                <MessageCirclePlus /> New Conversation
              </span>
            </DialogTitle>
          </DialogHeader>
          <div
            className={clsx(
              "max-h-[80vh] overflow-y-auto rounded-b-md pb-4 pl-4",
              "[&::-webkit-scrollbar]:w-0",
              "[&::-webkit-scrollbar-track]:rounded-md",
              "[&::-webkit-scrollbar-thumb]:rounded-md"
            )}
          >
            <ConversationForm
              onSuccess={() => setShowDialog(false)}
              teamId={teamId}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
