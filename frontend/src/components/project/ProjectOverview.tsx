import { Project } from "@/types/Project";
import { useProjectTasks } from "@/hooks/queries/project/useProjectTasks";
import { useProjectTeams } from "@/hooks/queries/project/useProjectTeams";
import { useProjectCollaborators } from "@/hooks/queries/project/useProjectCollaborators";
import { clsx } from "clsx";
import { ProgressSpinner } from "primereact/progressspinner";
import ProjectTaskCheckList from "./ProjectTaskCheckList";
import ProjectCollaborators from "./ProjectCollaborators";
import ProjectOverallProgressCard from "./ProjectOverallProgressCard";
import ProjectTeams from "./ProjectTeams";
import ProjectTasks from "./ProjectTasks";

type ProjectOverviewProps = {
  project: Project;
  onCollaboratorsSeeMoreClick?: () => void;
  onTasksSeeMoreClick?: () => void;
  onTeamsSeeMoreClick?: () => void;
};

export default function ProjectOverview({
  project,
  onCollaboratorsSeeMoreClick,
  onTasksSeeMoreClick,
  onTeamsSeeMoreClick,
}: ProjectOverviewProps) {
  const {
    data: projectTasks = [],
    isLoading: projectTasksLoading,
    isError: projectTasksError,
  } = useProjectTasks(project.id, { page: 1, pageSize: 10 });
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
            <div className={clsx("flex flex-2 flex-col gap-2.5")}>
              <div
                className={clsx(
                  "grid h-full w-full grid-cols-2 grid-rows-2 gap-2.5"
                )}
              >
                {/**Project collaborators summary */}
                <ProjectCollaborators
                  collaborators={projectCollaborators || []}
                  onSeeMore={onCollaboratorsSeeMoreClick}
                />

                {/**Project progress summary */}
                <ProjectOverallProgressCard project={project} />

                {/**Project teams summary */}
                <ProjectTeams
                  teams={projectTeams || []}
                  onSeeMore={onTeamsSeeMoreClick}
                />

                {/**Project near-due task */}
                <ProjectTasks
                  tasks={projectTasks || []}
                  onSeeMore={onTasksSeeMoreClick}
                />
              </div>
            </div>
            <div className={clsx("flex flex-1")}>
              <ProjectTaskCheckList
                tasks={projectTasks}
                onSeeMore={onTasksSeeMoreClick}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
