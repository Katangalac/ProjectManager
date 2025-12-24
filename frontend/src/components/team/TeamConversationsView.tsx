import { clsx } from "clsx";
import { useTeamConversations } from "@/hooks/queries/team/useTeamConversations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressSpinner } from "primereact/progressspinner";
import ConversationCard from "../conversation/ConversationView";
import ConversationMessages from "../conversation/ConversationMessagesView";
import { PlusIcon } from "@heroicons/react/24/outline";

type TeamConversationsViewProps = {
  teamId: string;
};

export default function TeamConversationsView({
  teamId,
}: TeamConversationsViewProps) {
  const {
    data: teamConversations = [],
    isLoading: teamConversationsIsLoading,
    isError: teamConversationsIsError,
  } = useTeamConversations(teamId!, { all: true });

  if (teamConversationsIsError)
    return <div>An error occur while loading team conversations</div>;

  console.log(teamConversations);

  return (
    <div className={clsx("w-full")}>
      {teamConversationsIsLoading ? (
        <ProgressSpinner />
      ) : (
        <div className="p-0">
          <Tabs
            defaultValue={teamConversations[0]?.id || "no-conversations"}
            className="flex w-full"
          >
            <TabsList className="flex h-screen max-w-80 min-w-70 flex-col items-start justify-start rounded-none border-r border-gray-300 bg-gray-100 px-0 first:border-t">
              <div className="mb-2 flex w-full items-center justify-between px-3 pt-2">
                <span className="font-medium text-black">Conversations</span>
                <button
                  className={clsx(
                    "flex cursor-pointer items-center justify-center gap-1 p-2",
                    "rounded-sm bg-sky-200 hover:bg-sky-300",
                    "focus:ring-2 focus:ring-sky-400 focus:outline-0",
                    "text-xs font-medium text-black"
                  )}
                >
                  <PlusIcon className={clsx("size-3 stroke-3")} />
                  New
                </button>
              </div>
              {teamConversations.map((conv, index) => (
                <TabsTrigger
                  key={conv.id}
                  value={conv.id}
                  className={clsx(
                    "max-h-30 min-h-30 max-w-full min-w-full cursor-pointer py-2",
                    "rounded-none hover:bg-sky-100 data-[state=active]:bg-sky-100",
                    "border-t border-gray-300 data-[state=active]:shadow-none",
                    index === teamConversations.length - 1 ? "border-b" : ""
                  )}
                >
                  <div className="flex max-w-full flex-col">
                    <ConversationCard
                      conversation={conv}
                      className="bg-transparent p-0 text-sm"
                    />
                  </div>
                </TabsTrigger>
              ))}
              {teamConversations.length === 0 && (
                <TabsTrigger
                  value="no-conversations"
                  className={clsx(
                    "max-h-30 min-h-30 max-w-full min-w-full cursor-pointer py-2",
                    "rounded-none hover:bg-sky-100 data-[state=active]:bg-sky-100",
                    "border-t border-b border-gray-300 data-[state=active]:shadow-none"
                  )}
                >
                  <span>No conversations</span>
                </TabsTrigger>
              )}
            </TabsList>

            {teamConversations.map((conv) => (
              <TabsContent key={conv.id} value={conv.id} className="w-full p-5">
                <ConversationMessages conversationId={conv.id} />
              </TabsContent>
            ))}

            {teamConversations.length === 0 && (
              <TabsContent value="no-conversations" className="w-full p-5">
                <span>No conversations</span>
              </TabsContent>
            )}
          </Tabs>
        </div>
      )}
    </div>
  );
}
