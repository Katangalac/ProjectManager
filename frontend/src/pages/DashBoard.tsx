import { clsx } from "clsx";
import { useUserStore } from "../stores/userStore";
import { useTasks } from "../hooks/queries/task/useTasks";
import { useTeams } from "../hooks/queries/team/useTeams";
import { useProjects } from "../hooks/queries/project/useProjects";
import { ProgressSpinner } from "primereact/progressspinner";
import { Project } from "@/types/Project";
import { Task, TaskWithRelations } from "@/types/Task";
import TaskDashboardCard from "@/components/task/TaskDashBoardCard";
import { Chart } from "primereact/chart";
import { getTaskStats, getProjectStats } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import DashboardStatsCard from "@/components/dashboard/DashboardStatsCard";
import NoItems from "@/components/commons/NoItems";
import UserErrorMessage from "@/components/commons/UserErrorMessage";

/**
 * Tableau de bord de l'application
 * Affiche les nombres de projets et taches ainsi que des statistiques
 * Affiche les 2 taches qui arrivent à leur échéance prochainement
 */
export default function DashBoard() {
  const { user } = useUserStore();
  const navigate = useNavigate();
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

  const taskStats = getTaskStats(tasks?.data || []);
  const projectStats = getProjectStats(projects || []);

  const data = {
    labels: ["Completed", "Blocked", "Todo", "In Progress"],
    datasets: [
      {
        data: [
          taskStats.completed,
          taskStats.blocked,
          taskStats.todo,
          taskStats.inProgress,
        ],
        backgroundColor: [
          "#22c55e", // green
          "#ef4444", // red
          "#facc15", // yellow
          "#3399ff", // blue
        ],
        hoverBackgroundColor: ["#16a34a", "#dc2626", "#eab308", "#1A82FF"],
      },
    ],
  };

  const projectData = {
    labels: ["Planning", "Active", "Paused", "Blocked", "Completed"],
    datasets: [
      {
        data: [
          projectStats.planning,
          projectStats.active,
          projectStats.paused,
          projectStats.blocked,
          projectStats.completed,
        ],
        backgroundColor: [
          "#E0F2FE",
          "#BAE6FD",
          "#7DD3FC",
          "#38BDF8",
          "#0EA5E9",
        ],
        hoverBackgroundColor: [
          "#BAE6FD",
          "#7DD3FC",
          "#38BDF8",
          "#0EA5E9",
          "#0284C7",
        ],
      },
    ],
  };

  const options = {
    cutout: "60%", // donut (plus grand = trou plus large)
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className={clsx("flex flex-1 items-center justify-center")}>
      {tasksError || projectsError || (teamsError && <UserErrorMessage />)}

      {tasksLoading || projectsLoading || teamsLoading ? (
        <div>
          <ProgressSpinner />
        </div>
      ) : (
        <div
          className={clsx(
            "flex min-h-screen min-w-full flex-col items-start justify-start gap-4 p-4",
            "bg-white",
            "dark:bg-gray-900"
          )}
        >
          <span className={clsx("text-sm text-gray-500")}>
            Hi <strong className="text-black">{user?.userName}</strong>! Plan,
            prioritize and accomplish your tasks and projects with ease.
          </span>

          {/**Projects snapshots */}
          <div
            className={clsx(
              "grid w-full grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6"
            )}
          >
            <DashboardStatsCard
              title="Total projects"
              value={projects?.length || 0}
              description="Projects"
              onSeeMore={() => navigate("/userProjects")}
            />

            <DashboardStatsCard
              title="Active projects"
              value={
                projects?.filter(
                  (project: Project) => project.status === "ACTIVE"
                ).length || 0
              }
              description="On going projects"
              onSeeMore={() => navigate("/userProjects")}
            />

            <DashboardStatsCard
              title="Ended projects"
              value={
                projects?.filter(
                  (project: Project) => project.status === "COMPLETED"
                ).length || 0
              }
              description="Completed projects"
              onSeeMore={() => navigate("/userProjects")}
            />

            <DashboardStatsCard
              title="Pending projects"
              value={
                projects?.filter(
                  (project: Project) =>
                    project.status === "PLANNING" || project.status === "PAUSED"
                ).length || 0
              }
              description="Projects in discuss"
              onSeeMore={() => navigate("/userProjects")}
            />
          </div>

          {/**Tasks snapshots */}
          <div
            className={clsx(
              "grid w-full grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6"
            )}
          >
            <DashboardStatsCard
              title="Total tasks"
              value={tasks?.data.length || 0}
              description="Tasks"
              onSeeMore={() => navigate("/userTasks")}
            />

            <DashboardStatsCard
              title="In progress"
              value={
                tasks?.data.filter(
                  (task: Task) => task.status === "IN_PROGRESS"
                ).length || 0
              }
              description="On going tasks"
              onSeeMore={() => navigate("/userTasks")}
            />

            <DashboardStatsCard
              title="Ended tasks"
              value={
                tasks?.data.filter((task: Task) => task.status === "COMPLETED")
                  .length || 0
              }
              description="Completed tasks"
              onSeeMore={() => navigate("/userTasks")}
            />

            <DashboardStatsCard
              title="Pending tasks"
              value={
                tasks?.data.filter((task: Task) => task.status === "TODO")
                  .length || 0
              }
              description="Tasks to do"
              onSeeMore={() => navigate("/userTasks")}
            />
          </div>

          <div
            className={clsx(
              "flex w-full items-stretch gap-6 sm:flex-col lg:flex-row"
            )}
          >
            <div
              className={clsx(
                "flex flex-1 flex-col justify-start gap-2",
                "rounded-md border border-gray-300 p-3"
              )}
            >
              <span className={clsx("mb-2 text-left text-sm text-gray-600")}>
                Near-due tasks
              </span>
              <div
                className={clsx(
                  "grid h-full w-full grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4"
                )}
              >
                {tasks && tasks.data.length > 0 ? (
                  <>
                    {tasks?.data.slice(0, 2).map((task: TaskWithRelations) => (
                      <TaskDashboardCard
                        task={task}
                        onclick={() => navigate("/userTasks")}
                      />
                    ))}
                  </>
                ) : (
                  <NoItems message="No tasks available" />
                )}
              </div>
            </div>

            <div
              className={clsx(
                "flex flex-col justify-start gap-2",
                "rounded-md border border-gray-300 p-3"
              )}
            >
              <span className={clsx("text-left text-sm text-gray-600")}>
                Tasks stats
              </span>
              <div className={clsx("flex justify-center")}>
                {tasks && tasks.data.length > 0 ? (
                  <Chart
                    type="doughnut"
                    data={data}
                    options={options}
                    className="w-64"
                  />
                ) : (
                  <NoItems message="No tasks available" />
                )}
              </div>
            </div>
          </div>
          {/* <div
            className={clsx(
              "flex w-75 flex-col justify-start gap-2",
              "rounded-md border border-gray-300 p-3"
            )}
          >
            <Chart
              type="doughnut"
              data={projectData}
              options={options}
              className="w-64"
            />
          </div> */}
        </div>
      )}
    </div>
  );
}
