import { clsx } from "clsx";
import { ConversationWithRelation } from "@/types/Conversation";
import { useTeamConversations } from "@/hooks/queries/team/useTeamConversations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressSpinner } from "primereact/progressspinner";

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
        <div>
          <Tabs defaultValue="account" className="flex w-[400px]">
            <TabsList className="flex h-screen max-w-50 flex-col items-start justify-start rounded-sm bg-gray-100">
              {teamConversations.map((conv) => (
                <TabsTrigger
                  key={conv.id}
                  value={conv.id}
                  className="max-w-full rounded-sm"
                >
                  <div className="flex max-w-full flex-col">
                    <span className="truncate">
                      {conv.messages
                        ? conv.messages[0]
                          ? conv.messages[0].content
                          : "Untitled"
                        : "Untitled"}
                    </span>
                    <span className="text-right text-xs">
                      {conv.messages
                        ? conv.messages[0]
                          ? new Date(conv.messages[0].createdAt)
                              .toISOString()
                              .split("T")[0]
                          : "Untitled"
                        : "Untitled"}
                    </span>
                  </div>
                </TabsTrigger>
              ))}
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              Make changes to your account here.
            </TabsContent>
            <TabsContent value="password">
              Change your password here.
            </TabsContent>
            {teamConversations.map((conv) => (
              <TabsContent key={conv.id} value={conv.id}>
                {conv.messages
                  ? conv.messages[0]
                    ? conv.messages[0].content
                    : "Untitled"
                  : "Untitled"}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
}
