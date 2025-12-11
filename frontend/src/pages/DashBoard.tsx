import { clsx } from "clsx";
import { useUserStore } from "../stores/userStore";
import { useTasks } from "../hooks/queries/task/useTasks";
import { useTeams } from "../hooks/queries/team/useTeams";
import { useProjects } from "../hooks/queries/project/useProjects";
import { ProgressSpinner } from "primereact/progressspinner";

export default function DashBoard() {
  const { user } = useUserStore();
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useTasks({ all: true });
  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useProjects({ all: true });
  const {
    data: teams,
    isLoading: teamsLoading,
    isError: teamsError,
  } = useTeams({ all: true });

  return (
    <div
      className={clsx(
        "flex min-h-screen min-w-full items-center justify-center",
        "bg-white",
        "dark:bg-gray-900"
      )}
    >
      {tasksError && <div>An error occur while loading user tasks</div>}

      {teamsError && <div>An error occur while loading user teams</div>}

      {projectsError && <div>An error occur while loading user projects</div>}

      {tasksLoading || projectsLoading || teamsLoading ? (
        <div>
          <ProgressSpinner />
        </div>
      ) : (
        <div>
          <h1
            className={clsx("text-2xl font-bold text-black", "dark:text-white")}
          >
            Bonjour {user?.userName}! Bon retour parmi nous
          </h1>
          <div className={clsx("flex flex-col gap-1 text-sm text-black")}>
            <span>Tasks: {tasks?.data.length}</span>
            <span>Projects: {projects?.length}</span>
            <span>Teams: {teams?.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}
