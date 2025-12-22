import { clsx } from "clsx";
import { useTeamById } from "../hooks/queries/team/useTeamById";
import { useParams } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamNameAcronym from "@/components/team/TeamNameAcronym";
import TeamMembersView from "@/components/team/TeamMembersView";
import TeamAbout from "@/components/team/TeamAbout";
import TeamConversationsView from "@/components/team/TeamConversationsView";

export default function TeamDetailsPage() {
  const { teamId } = useParams();
  const { data, isLoading, isError } = useTeamById(teamId!);

  if (isError) return <div>An error occur while loading team</div>;

  return (
    <div
      className={clsx(
        "flex h-full min-h-screen items-start justify-start gap-5"
      )}
    >
      {isLoading ? (
        <ProgressSpinner />
      ) : (
        <>
          {data && (
            <Tabs defaultValue="publications" className="h-fit w-full py-0">
              <TabsList className="h-fit w-full justify-start gap-4 rounded-none border-b border-sky-200 bg-sky-100 px-5 py-0 shadow-xs shadow-gray-400">
                <div className={clsx("mr-4 flex w-fit items-center gap-2")}>
                  <TeamNameAcronym
                    name={data.name}
                    className="h-fit w-fit px-2 py-2"
                    textClassName="text-red-500 text-xs font-medium"
                  />
                  <span className="font-bold text-black">{data.name}</span>
                </div>
                <TabsTrigger
                  className={clsx(
                    "w-fit rounded-none px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                    "data-[state=active]:border-b-3 data-[state=active]:border-sky-600",
                    "data-[state=active]:text-black",
                    "hover:text-black"
                  )}
                  value="publications"
                >
                  Publications
                </TabsTrigger>
                <TabsTrigger
                  className={clsx(
                    "w-fit rounded-none px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                    "data-[state=active]:border-b-3 data-[state=active]:border-sky-600",
                    "data-[state=active]:text-black",
                    "hover:text-black"
                  )}
                  value="members"
                >
                  Members
                </TabsTrigger>
                <TabsTrigger
                  className={clsx(
                    "w-fit rounded-none px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                    "data-[state=active]:border-b-3 data-[state=active]:border-sky-600",
                    "data-[state=active]:text-black",
                    "hover:text-black"
                  )}
                  value="invitations"
                >
                  Invitations
                </TabsTrigger>
                <TabsTrigger
                  className={clsx(
                    "w-fit rounded-none px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                    "data-[state=active]:border-b-3 data-[state=active]:border-sky-600",
                    "data-[state=active]:text-black",
                    "hover:text-black"
                  )}
                  value="about"
                >
                  About
                </TabsTrigger>
              </TabsList>
              <div className={clsx("px-5")}>
                <TabsContent value="publications">
                  <TeamConversationsView teamId={teamId!} />
                </TabsContent>
                <TabsContent value="members">
                  <TeamMembersView team={data} />
                </TabsContent>
                <TabsContent value="invitations">
                  Will be add soon. Keep in touch!
                </TabsContent>
                <TabsContent value="about">
                  <TeamAbout team={data} />
                </TabsContent>
              </div>
            </Tabs>
          )}
        </>
      )}
    </div>
  );
}
