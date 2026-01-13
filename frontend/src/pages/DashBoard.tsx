import { clsx } from "clsx";
import { useUserStore } from "../stores/userStore";
import { useTasks } from "../hooks/queries/task/useTasks";
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
import ProjectCard from "@/components/project/ProjectCard";

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

  const filteredProjects =
    projects?.data.filter((project) => project.status !== "COMPLETED") ?? [];
  const filteredTasks =
    tasks?.data.filter((task) => task.status !== "COMPLETED") ?? [];

  const taskStats = getTaskStats(tasks?.data ?? []);
  const projectStats = getProjectStats(projects?.data ?? []);

  //Données pour le chart de taches
  const taskData = {
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
          "#22C55E", // completed
          "#EF4444", // blocked
          "#FACC15", // to do
          "#3B82F6", // in progress
        ],
        hoverBackgroundColor: [
          "#16A34A", // completed
          "#DC2626", // blocked
          "#EAB308", // to do
          "#2563EB", // in progress
        ],
      },
    ],
  };

  //Données pour le chart des projets
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
          "#94A3B8", // planning
          "#60A5FA", // active
          "#FACC15", // paused
          "#F87171", // blocked
          "#4ADE80", // completed
        ],
        hoverBackgroundColor: [
          "#64748B", // planning
          "#3B82F6", // active
          "#EAB308", // paused
          "#EF4444", // blocked
          "#22C55E", // completed
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
      {(tasksError || projectsError) && <UserErrorMessage />}

      {tasksLoading || projectsLoading ? (
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
              value={projects?.data.length ?? 0}
              description="Projects"
              onSeeMore={() => navigate("/userProjects")}
            />

            <DashboardStatsCard
              title="Active projects"
              value={
                projects?.data.filter(
                  (project: Project) => project.status === "ACTIVE"
                ).length ?? 0
              }
              description="On going projects"
              onSeeMore={() => navigate("/userProjects")}
            />

            <DashboardStatsCard
              title="Ended projects"
              value={
                projects?.data.filter(
                  (project: Project) => project.status === "COMPLETED"
                ).length ?? 0
              }
              description="Completed projects"
              onSeeMore={() => navigate("/userProjects")}
            />

            <DashboardStatsCard
              title="Pending projects"
              value={
                projects?.data.filter(
                  (project: Project) =>
                    project.status === "PLANNING" || project.status === "PAUSED"
                ).length ?? 0
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
              value={tasks?.data.length ?? 0}
              description="Tasks"
              onSeeMore={() => navigate("/userTasks")}
            />

            <DashboardStatsCard
              title="In progress"
              value={
                tasks?.data.filter(
                  (task: Task) => task.status === "IN_PROGRESS"
                ).length ?? 0
              }
              description="On going tasks"
              onSeeMore={() => navigate("/userTasks")}
            />

            <DashboardStatsCard
              title="Ended tasks"
              value={
                tasks?.data.filter((task: Task) => task.status === "COMPLETED")
                  .length ?? 0
              }
              description="Completed tasks"
              onSeeMore={() => navigate("/userTasks")}
            />

            <DashboardStatsCard
              title="Pending tasks"
              value={
                tasks?.data.filter((task: Task) => task.status === "TODO")
                  .length ?? 0
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
                Near-due projects
              </span>
              <div
                className={clsx(
                  "grid h-full w-full grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4"
                )}
              >
                {filteredProjects.length > 0 ? (
                  <>
                    {filteredProjects.slice(0, 2).map((project, index) => (
                      <ProjectCard
                        key={index}
                        project={project}
                        className="w-full max-w-full shadow-none"
                      />
                    ))}
                  </>
                ) : (
                  <NoItems message="No projects available" />
                )}
              </div>
            </div>

            <div
              className={clsx(
                "flex min-h-60 min-w-52 flex-col justify-start gap-2",
                "rounded-md border border-gray-300 p-3"
              )}
            >
              <span className={clsx("text-left text-sm text-gray-600")}>
                Project stats
              </span>
              <div className={clsx("flex h-full items-center justify-center")}>
                {projects && projects.data.length > 0 ? (
                  <Chart
                    type="doughnut"
                    data={projectData}
                    options={options}
                    className="w-64"
                  />
                ) : (
                  <NoItems message="No projects available" />
                )}
              </div>
            </div>
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
                {tasks &&
                tasks.data.filter((task) => task.status !== "COMPLETED")
                  .length > 0 ? (
                  <>
                    {filteredTasks
                      .slice(0, 2)
                      .map((task: TaskWithRelations, index) => (
                        <TaskDashboardCard
                          key={index}
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
                "flex min-h-60 min-w-52 flex-col justify-start gap-2",
                "rounded-md border border-gray-300 p-3"
              )}
            >
              <span className={clsx("text-left text-sm text-gray-600")}>
                Tasks stats
              </span>
              <div className={clsx("flex h-full items-center justify-center")}>
                {tasks && tasks.data.length > 0 ? (
                  <Chart
                    type="doughnut"
                    data={taskData}
                    options={options}
                    className="w-64"
                  />
                ) : (
                  <NoItems
                    message="No tasks available"
                    className="h-fit w-fit"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
