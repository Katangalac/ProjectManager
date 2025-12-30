import { useParams } from "react-router-dom";
import { useProjectById } from "@/hooks/queries/project/useProjectById";
import { clsx } from "clsx";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { PROJECT_STATUS_META } from "@/lib/constants/project";
import {
  ArrowCircleLeftIcon,
  CircleIcon,
  GridFourIcon,
  ClockCounterClockwiseIcon,
} from "@phosphor-icons/react";
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  InformationCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "@/utils/dateUtils";
import ProjectOverview from "@/components/project/ProjectOverview";
import TasksView from "@/components/task/TasksView";

/**
 * Affiche les informations détaillées d'un projet
 */
export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useProjectById(projectId!);
  return (
    <div className={clsx("h-screen w-full")}>
      {isLoading ? (
        <ProgressSpinner />
      ) : (
        <div>
          {isError && <div>An error occur while loading the project</div>}
          {data && (
            <div className={clsx("flex flex-col")}>
              <div
                className={clsx("w-full px-2 py-3", "border-b border-gray-300")}
              >
                <div className={clsx("flex w-fit items-center gap-5")}>
                  <div className={clsx("flex w-fit items-center gap-2")}>
                    <div
                      className={clsx("flex h-fit w-fit items-center gap-1")}
                    >
                      <ArrowCircleLeftIcon
                        weight="regular"
                        className={clsx("size-5 cursor-pointer text-gray-600")}
                        onClick={() => navigate("/userProjects")}
                      />
                      <span className="text-sm font-medium text-black">
                        {data.title}
                      </span>
                    </div>

                    <div
                      className={clsx(
                        "flex w-fit items-center gap-1 rounded-sm border border-gray-300 px-2 py-0.5 text-xs",
                        "dark:border-gray-500"
                      )}
                    >
                      <CircleIcon
                        size={8}
                        weight="fill"
                        className={clsx(
                          PROJECT_STATUS_META[data.status].textColor
                        )}
                      />
                      <span>{PROJECT_STATUS_META[data.status].label}</span>
                    </div>
                  </div>
                  <div className={clsx("flex w-fit items-center gap-1.5")}>
                    <div className={clsx("w-30")}>
                      <Progress
                        value={data.progress}
                        className={clsx("h-1.5 w-full [&>div]:bg-sky-500")}
                      />
                    </div>
                    <span className={clsx("text-xs font-medium text-gray-600")}>
                      {data.progress}% completed
                    </span>
                  </div>
                  <div
                    className={clsx(
                      "flex h-fit w-fit items-center rounded-xl border border-gray-300 px-2 py-0.5"
                    )}
                  >
                    <span
                      className={clsx(
                        "flex items-center gap-1 text-xs font-medium text-gray-600"
                      )}
                    >
                      <ClockCounterClockwiseIcon
                        weight="bold"
                        size={12}
                        className={clsx("stroke-1")}
                      />
                      Last update: {timeAgo(new Date(data.updatedAt), true)}
                    </span>
                  </div>
                </div>
              </div>
              <Tabs defaultValue="overview" className="h-fit w-full gap-0">
                <TabsList className="h-fit w-full justify-start gap-5 rounded-none border-b border-gray-300 px-3 py-0">
                  <TabsTrigger
                    className={clsx(
                      "w-fit rounded-none px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                      "data-[state=active]:border-b-3 data-[state=active]:border-sky-600",
                      "data-[state=active]:text-black",
                      "hover:text-black",
                      "cursor-pointer",
                      "font-normal text-gray-600 data-[state=active]:font-medium"
                    )}
                    value="overview"
                  >
                    <span className={clsx("flex items-center gap-1 stroke-1")}>
                      <GridFourIcon
                        weight="regular"
                        className={clsx("size-4.5")}
                      />{" "}
                      Overview
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    className={clsx(
                      "w-fit rounded-none px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                      "data-[state=active]:border-b-3 data-[state=active]:border-sky-600",
                      "data-[state=active]:text-black",
                      "hover:text-black",
                      "cursor-pointer",
                      "font-normal text-gray-600 data-[state=active]:font-medium"
                    )}
                    value="teams"
                  >
                    <span className={clsx("flex items-center gap-1 stroke-1")}>
                      <UserGroupIcon className={clsx("size-4.5")} /> Teams
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    className={clsx(
                      "w-fit rounded-none px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                      "data-[state=active]:border-b-3 data-[state=active]:border-sky-600",
                      "data-[state=active]:text-black",
                      "hover:text-black",
                      "cursor-pointer",
                      "font-normal text-gray-600 data-[state=active]:font-medium"
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
                      "data-[state=active]:border-b-3 data-[state=active]:border-sky-600",
                      "data-[state=active]:text-black",
                      "hover:text-black",
                      "cursor-pointer",
                      "font-normal text-gray-600 data-[state=active]:font-medium"
                    )}
                    value="collaborators"
                  >
                    <span className={clsx("flex items-center gap-1 stroke-1")}>
                      <UsersIcon className={clsx("size-4.5")} /> Collaborators
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    className={clsx(
                      "w-fit rounded-none px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                      "data-[state=active]:border-b-3 data-[state=active]:border-sky-600",
                      "data-[state=active]:text-black",
                      "hover:text-black",
                      "cursor-pointer",
                      "font-normal text-gray-600 data-[state=active]:font-medium"
                    )}
                    value="about"
                  >
                    <span className={clsx("flex items-center gap-1 stroke-1")}>
                      <InformationCircleIcon className={clsx("size-4.5")} />{" "}
                      About
                    </span>
                  </TabsTrigger>
                </TabsList>
                <div>
                  <TabsContent value="overview" className={clsx("h-full px-5")}>
                    <ProjectOverview project={data} />
                  </TabsContent>
                  <TabsContent value="teams" className={clsx("px-5")}>
                    Will be add soon. Keep in touch!
                  </TabsContent>
                  <TabsContent value="tasks" className={clsx("px-5")}>
                    <TasksView projectId={data.id} />
                  </TabsContent>

                  <TabsContent value="collaborators" className={clsx("px-5")}>
                    Will be add soon. Keep in touch!
                  </TabsContent>
                  <TabsContent value="about" className={clsx("px-5")}>
                    Will be add soon. Keep in touch!
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
