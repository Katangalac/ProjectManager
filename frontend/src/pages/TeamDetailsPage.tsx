import { clsx } from "clsx";
import { useTeamById } from "../hooks/queries/team/useTeamById";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamNameAcronym from "@/components/team/TeamNameAcronym";
import TeamMembersView from "@/components/team/TeamMembersView";
import TeamAbout from "@/components/team/TeamAbout";
import TeamConversationsView from "@/components/team/TeamConversationsView";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  InformationCircleIcon,
  ChatBubbleLeftRightIcon,
  UserPlusIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import TeamInvitationsView from "@/components/team/TeamInvitationsView";
import TeamProjectsView from "@/components/team/TeamProjectsView";
import TeamTasksView from "@/components/team/TeamTasksView";

/**
 * Affiche les informations détaillées d'une équipe :
 *  - les conversations de l'équipe
 *  - les memebres de l'équipe
 *  - la description de l' équipe
 */
export default function TeamDetailsPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useTeamById(teamId!);

  if (isError) return <div>An error occur while loading team</div>;

  return (
    <div className={clsx("flex h-full items-start justify-start gap-5")}>
      {isLoading ? (
        <ProgressSpinner />
      ) : (
        <>
          {data && (
            <Tabs defaultValue="projects" className="h-full w-full gap-0">
              <TabsList className="h-fit w-full justify-start gap-5 rounded-none border-b border-gray-300 px-3 py-0">
                <div className={clsx("mr-4 flex w-fit items-center gap-2")}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={clsx(
                          "flex cursor-pointer items-center justify-center rounded-full bg-white p-0.5",
                          "hover:bg-gray-100",
                          "border border-gray-400"
                        )}
                        onClick={() => navigate("/userTeams")}
                      >
                        <ArrowLeftIcon
                          weight="bold"
                          className={clsx(
                            "size-2.5 cursor-pointer text-gray-500 hover:text-gray-700"
                          )}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Teams</TooltipContent>
                  </Tooltip>

                  <TeamNameAcronym
                    id={data.data.id}
                    name={data.data.name}
                    className="h-fit w-fit px-2 py-2"
                    textClassName="text-red-500 text-xs font-medium"
                  />
                  <span className="text-sm font-medium text-black">
                    {data.data.name}
                  </span>
                </div>
                <TabsTrigger
                  className={clsx(
                    "w-fit rounded-none px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                    "data-[state=active]:border-b-3 data-[state=active]:border-sky-500",
                    "data-[state=active]:text-black",
                    "hover:text-black"
                  )}
                  value="projects"
                >
                  <span className={clsx("flex items-center gap-1 stroke-1")}>
                    <FolderIcon className={clsx("size-4.5")} /> Projects
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  className={clsx(
                    "w-fit rounded-none px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                    "data-[state=active]:border-b-3 data-[state=active]:border-sky-500",
                    "data-[state=active]:text-black",
                    "hover:text-black"
                  )}
                  value="tasks"
                >
                  <span className={clsx("flex items-center gap-1 stroke-1")}>
                    <ClipboardDocumentListIcon className={clsx("size-4.5")} />{" "}
                    Tasks
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  className={clsx(
                    "w-fit rounded-none px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                    "data-[state=active]:border-b-3 data-[state=active]:border-sky-500",
                    "data-[state=active]:text-black",
                    "hover:text-black"
                  )}
                  value="publications"
                >
                  <span className={clsx("flex items-center gap-1 stroke-1")}>
                    <ChatBubbleLeftRightIcon className={clsx("size-4.5")} />{" "}
                    Publications
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  className={clsx(
                    "w-fit rounded-none px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                    "data-[state=active]:border-b-3 data-[state=active]:border-sky-500",
                    "data-[state=active]:text-black",
                    "hover:text-black"
                  )}
                  value="members"
                >
                  <span className={clsx("flex items-center gap-1 stroke-1")}>
                    <UserGroupIcon className={clsx("size-4.5")} /> Members
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  className={clsx(
                    "w-fit rounded-none px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                    "data-[state=active]:border-b-3 data-[state=active]:border-sky-500",
                    "data-[state=active]:text-black",
                    "hover:text-black"
                  )}
                  value="invitations"
                >
                  <span className={clsx("flex items-center gap-1 stroke-1")}>
                    <UserPlusIcon className={clsx("size-4.5")} /> Invitations
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  className={clsx(
                    "w-fit rounded-none px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                    "data-[state=active]:border-b-3 data-[state=active]:border-sky-500",
                    "data-[state=active]:text-black",
                    "hover:text-black"
                  )}
                  value="about"
                >
                  <span className={clsx("flex items-center gap-1 stroke-1")}>
                    <InformationCircleIcon className={clsx("size-4.5")} /> About
                  </span>
                </TabsTrigger>
              </TabsList>
              <div className={clsx("h-full w-full")}>
                <TabsContent value="projects" className={clsx("px-5")}>
                  <TeamProjectsView teamId={teamId!} />
                </TabsContent>
                <TabsContent value="tasks" className={clsx("px-5")}>
                  <TeamTasksView teamId={teamId!} />
                </TabsContent>
                <TabsContent value="publications" className="m-0 h-full w-full">
                  <TeamConversationsView teamId={teamId!} />
                </TabsContent>
                <TabsContent value="members" className={clsx("px-5")}>
                  <TeamMembersView team={data.data} />
                </TabsContent>
                <TabsContent value="invitations" className={clsx("px-5")}>
                  <TeamInvitationsView teamId={teamId!} />
                </TabsContent>
                <TabsContent value="about" className={clsx("px-5")}>
                  <TeamAbout team={data.data} />
                </TabsContent>
              </div>
            </Tabs>
          )}
        </>
      )}
    </div>
  );
}
