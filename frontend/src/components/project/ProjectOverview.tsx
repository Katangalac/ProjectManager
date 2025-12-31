import { Project } from "@/types/Project";
import { useProjectTasks } from "@/hooks/queries/project/useProjectTasks";
import { useProjectTeams } from "@/hooks/queries/project/useProjectTeams";
import { useProjectCollaborators } from "@/hooks/queries/project/useProjectCollaborators";
import { clsx } from "clsx";
import { ProgressSpinner } from "primereact/progressspinner";
import UserBasicInfo from "../profile/UserBasicInfo";
import TeamBasicInfos from "../team/TeamBasicInfos";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { CircleIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { useState } from "react";
import UserProfilePhoto from "../profile/UserProfilePhoto";
import { dateToLongString } from "@/utils/dateUtils";
import { Progress } from "../ui/progress";
import { Inbox } from "lucide-react";
import ProjectTaskCheckList from "./ProjectTaskCheckList";

type ProjectOverviewProps = {
  project: Project;
};

export default function ProjectOverview({ project }: ProjectOverviewProps) {
  const {
    data: projectTasks = [],
    isLoading: projectTasksLoading,
    isError: projectTasksError,
  } = useProjectTasks(project.id, { page: 1, pageSize: 30 });
  const {
    data: projectTeams,
    isLoading: projectTeamsLoading,
    isError: projectTeamsError,
  } = useProjectTeams(project.id, { page: 1, pageSize: 10 });
  const {
    data: projectCollaborators,
    isLoading: projectCollaboratorsLoading,
    isError: projectCollaboratorsError,
  } = useProjectCollaborators(project.id, { page: 1, pageSize: 10 });
  const [taskIndex, setTaskIndex] = useState<number>(0);

  return (
    <div className={clsx("flex h-full w-full items-center")}>
      {projectTasksLoading ||
      projectTeamsLoading ||
      projectCollaboratorsLoading ? (
        <ProgressSpinner />
      ) : (
        <div className={clsx("flex h-full w-full flex-col justify-start")}>
          {projectTasksError && (
            <span>An error occur while laoding project tasks</span>
          )}
          {projectTeamsError && (
            <span>An error occur while laoding project teams</span>
          )}
          {projectCollaboratorsError && (
            <span>An error occur while laoding project collaborators</span>
          )}
          <div className={clsx("flex h-full w-full gap-2")}>
            <div className={clsx("flex h-full w-fit flex-col gap-2.5")}>
              <div className={clsx("flex h-fit w-fit gap-4 p-1")}>
                {/**Project collaborators summary */}
                <div
                  className={clsx(
                    "flex h-65.5 w-72 flex-col",
                    "rounded-sm border border-gray-300"
                  )}
                >
                  <div
                    className={clsx(
                      "flex w-full items-center justify-start px-2 py-3",
                      "rounded-t-sm bg-sky-50"
                    )}
                  >
                    <span
                      className={clsx(
                        "text-left text-sm font-medium text-black"
                      )}
                    >
                      Collaborators
                    </span>
                  </div>
                  <div
                    className={clsx(
                      "flex h-full w-full flex-col justify-between"
                    )}
                  >
                    <div
                      className={clsx(
                        "flex h-full max-h-36 w-full flex-col",
                        "overflow-y-auto",
                        "[&::-webkit-scrollbar]:w-0",
                        "[&::-webkit-scrollbar-track]:bg-neutral-200",
                        "[&::-webkit-scrollbar-thumb]:bg-neutral-300"
                      )}
                    >
                      {projectCollaborators?.map((user) => (
                        <div className={clsx("h-fit w-full px-2")}>
                          <div
                            className={clsx(
                              "w-full py-2",
                              "border-b border-gray-300"
                            )}
                          >
                            <UserBasicInfo user={user} />
                          </div>
                        </div>
                      ))}
                      {projectCollaborators?.length === 0 && (
                        <div
                          className={clsx(
                            "flex h-full w-full flex-col items-center justify-center gap-2 text-gray-500"
                          )}
                        >
                          <Inbox className={clsx("size-10 stroke-1")} />
                          <span>No collaborators</span>
                        </div>
                      )}
                    </div>
                    <div className={clsx("h-fit w-full px-2 pb-3")}>
                      <button
                        className={clsx(
                          "flex w-full cursor-pointer justify-center px-2 py-1",
                          "rounded-md border border-gray-300",
                          "hover:bg-gray-100 hover:text-gray-700",
                          "text-sm text-gray-500"
                        )}
                      >
                        See all
                      </button>
                    </div>
                  </div>
                </div>

                {/**Project progress summary */}
                <div
                  className={clsx(
                    "flex h-65.5 w-72 flex-col gap-2",
                    "rounded-sm border border-gray-300"
                  )}
                >
                  <div
                    className={clsx(
                      "flex w-full items-center justify-start px-2 py-3",
                      "rounded-t-sm bg-sky-50"
                    )}
                  >
                    <span
                      className={clsx(
                        "text-left text-sm font-medium text-black"
                      )}
                    >
                      Overall progress
                    </span>
                  </div>
                  <div className={clsx("flex w-full flex-col gap-3 p-2")}>
                    <div className={clsx("flex w-full flex-col gap-2")}>
                      <Progress
                        value={project.progress}
                        className={clsx("[&>div]:bg-sky-500")}
                      />
                      <span
                        className={clsx(
                          "w-full",
                          "text-left text-[13px] font-medium text-black"
                        )}
                      >
                        {project.progress}% completed
                      </span>
                    </div>

                    <div className={clsx("flex flex-col gap-[0.5px]")}>
                      <span
                        className={clsx("text-left text-[12px] text-gray-600")}
                      >
                        Description
                      </span>
                      <p
                        className={clsx(
                          "overflow-x-auto text-left text-sm text-black",
                          "[&::-webkit-scrollbar]:w-0.5",
                          "[&::-webkit-scrollbar-track]:bg-gray-300",
                          "[&::-webkit-scrollbar-thumb]:bg-gray-400"
                        )}
                      >
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={clsx("flex h-fit w-fit gap-4 p-1")}>
                {/**Project teams summary */}
                <div
                  className={clsx(
                    "flex h-65.5 w-72 flex-col",
                    "rounded-sm border border-gray-300"
                  )}
                >
                  <div
                    className={clsx(
                      "flex w-full items-center justify-start px-2 py-3",
                      "rounded-t-sm bg-sky-50"
                    )}
                  >
                    <span
                      className={clsx(
                        "text-left text-sm font-medium text-black"
                      )}
                    >
                      Teams
                    </span>
                  </div>
                  <div
                    className={clsx(
                      "flex h-full w-full flex-col justify-between"
                    )}
                  >
                    <div
                      className={clsx(
                        "flex h-full max-h-36 w-full flex-col",
                        "overflow-y-auto",
                        "[&::-webkit-scrollbar]:w-0",
                        "[&::-webkit-scrollbar-track]:bg-neutral-200",
                        "[&::-webkit-scrollbar-thumb]:bg-neutral-300"
                      )}
                    >
                      {projectTeams?.map((team) => (
                        <div className={clsx("h-fit w-full px-2")}>
                          <div
                            className={clsx(
                              "w-full py-2",
                              "border-b border-gray-300"
                            )}
                          >
                            <TeamBasicInfos team={team} />
                          </div>
                        </div>
                      ))}

                      {projectTeams?.length === 0 && (
                        <div
                          className={clsx(
                            "flex h-full w-full flex-col items-center justify-center gap-2 text-gray-500"
                          )}
                        >
                          <Inbox className={clsx("size-10 stroke-1")} />
                          <span>No teams</span>
                        </div>
                      )}
                    </div>
                    <div className={clsx("h-fit w-full px-2 pb-3")}>
                      <button
                        className={clsx(
                          "flex w-full cursor-pointer justify-center px-2 py-1",
                          "rounded-md border border-gray-300",
                          "hover:bg-gray-100 hover:text-gray-700",
                          "text-sm text-gray-500"
                        )}
                      >
                        See all
                      </button>
                    </div>
                  </div>
                </div>

                {/**Project near-due task */}
                <div
                  className={clsx(
                    "flex h-65.5 w-72 flex-col gap-2 rounded-sm border border-gray-300"
                  )}
                >
                  <div
                    className={clsx(
                      "flex h-fit w-full items-center justify-between px-2 py-3",
                      "rounded-t-sm bg-sky-50"
                    )}
                  >
                    <span
                      className={clsx(
                        "text-left text-sm font-medium text-black"
                      )}
                    >
                      Tasks
                    </span>
                    <div className={clsx("flex gap-2")}>
                      <button
                        title="Previous"
                        disabled={taskIndex === 0}
                        onClick={() => setTaskIndex(taskIndex - 1)}
                        className={clsx(
                          "h-fit w-fit cursor-pointer p-1",
                          "rounded-sm border border-gray-300 bg-white",
                          "hover:bg-sky-100"
                        )}
                      >
                        <ChevronLeftIcon
                          className={clsx("size-3 stroke-1 text-black")}
                        />
                      </button>
                      <button
                        title="Next"
                        disabled={taskIndex >= projectTasks.length - 1}
                        onClick={() => setTaskIndex(taskIndex + 1)}
                        className={clsx(
                          "h-fit w-fit cursor-pointer p-1",
                          "rounded-sm border border-gray-300 bg-white",
                          "hover:bg-sky-100"
                        )}
                      >
                        <ChevronRightIcon
                          className={clsx("size-3 stroke-1 text-black")}
                        />
                      </button>
                    </div>
                  </div>
                  <div
                    className={clsx(
                      "flex h-full w-full flex-col justify-between"
                    )}
                  >
                    <div
                      className={clsx(
                        "flex h-full max-h-36 w-full flex-col px-2",
                        "overflow-y-auto",
                        "[&::-webkit-scrollbar]:w-0",
                        "[&::-webkit-scrollbar-track]:bg-neutral-200",
                        "[&::-webkit-scrollbar-thumb]:bg-neutral-300"
                      )}
                    >
                      {projectTasks.length >= 1 ? (
                        <div
                          className={clsx(
                            "flex h-full w-full flex-col gap-2.5"
                          )}
                        >
                          <div className={clsx("flex flex-col gap-[0.5px]")}>
                            <span
                              className={clsx(
                                "text-left text-[10px] text-gray-600"
                              )}
                            >
                              Task name
                            </span>
                            <span
                              className={clsx(
                                "text-left text-xs font-medium text-black"
                              )}
                            >
                              {projectTasks[taskIndex]?.title}
                            </span>
                          </div>

                          <div className={clsx("flex gap-4")}>
                            <div
                              className={clsx(
                                "flex max-w-20 flex-col gap-[0.5px]"
                              )}
                            >
                              <span
                                className={clsx(
                                  "text-left text-[10px] text-gray-600"
                                )}
                              >
                                Assigned to
                              </span>
                              <div
                                className={clsx(
                                  "flex -space-x-2",
                                  "overflow-x-auto",
                                  "[&::-webkit-scrollbar]:w-0"
                                )}
                              >
                                {projectTasks[taskIndex]?.assignedTo?.map(
                                  (user) => (
                                    <UserProfilePhoto
                                      key={user.user.id}
                                      imageUrl={user.user.imageUrl}
                                      username={user.user.userName}
                                      email={user.user.email}
                                      className="ring-1 ring-white"
                                      size="h-6 w-6"
                                    />
                                  )
                                )}
                                {projectTasks[taskIndex]?.assignedTo?.length ===
                                  0 && (
                                  <span className={clsx("text-left text-xs")}>
                                    None
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className={clsx("flex flex-col gap-[0.5px]")}>
                              <span
                                className={clsx(
                                  "text-left text-[10px] text-gray-600"
                                )}
                              >
                                Deadline
                              </span>
                              <span
                                className={clsx("text-left text-xs text-black")}
                              >
                                {dateToLongString(
                                  new Date(projectTasks[taskIndex]?.deadline)
                                )}
                              </span>
                            </div>
                          </div>

                          <div className={clsx("flex flex-col gap-[0.5px]")}>
                            <span
                              className={clsx(
                                "text-left text-[10px] text-gray-600"
                              )}
                            >
                              Description
                            </span>
                            <p
                              className={clsx(
                                "overflow-x-auto text-left text-xs text-black",
                                "[&::-webkit-scrollbar]:w-0.5",
                                "[&::-webkit-scrollbar-track]:bg-gray-300",
                                "[&::-webkit-scrollbar-thumb]:bg-gray-400"
                              )}
                            >
                              {projectTasks[taskIndex]?.description}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={clsx(
                            "flex h-full w-full flex-col items-center justify-center gap-2 text-gray-500"
                          )}
                        >
                          <Inbox className={clsx("size-10 stroke-1")} />
                          <span>No tasks</span>
                        </div>
                      )}
                    </div>
                    <div className={clsx("h-fit w-full px-2 pb-3")}>
                      <button
                        className={clsx(
                          "flex w-full cursor-pointer justify-center px-2 py-1",
                          "rounded-md border border-gray-300",
                          "hover:bg-gray-100 hover:text-gray-700",
                          "text-sm text-gray-500"
                        )}
                      >
                        See all
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={clsx("flex h-full w-[35%] gap-2 p-1")}>
              <ProjectTaskCheckList tasks={projectTasks} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
