import { clsx } from "clsx";
import { useUserStore } from "../stores/userStore";
import { useTasks } from "../hooks/queries/task/useTasks";
import { useTeams } from "../hooks/queries/team/useTeams";
import { useProjects } from "../hooks/queries/project/useProjects";
import { ProgressSpinner } from "primereact/progressspinner";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { Project } from "@/types/Project";
import { Task, TaskWithRelations } from "@/types/Task";
import TaskDashboardCard from "@/components/task/TaskDashBoardCard";
import { Chart } from "primereact/chart";
import { getTaskStats, getProjectStats } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

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
            <div
              className={clsx(
                "flex h-24 w-full flex-col justify-between gap-2",
                "rounded-md border border-gray-300 bg-white p-3"
              )}
            >
              <div className={clsx("flex items-center justify-between")}>
                <span className={clsx("text-sm text-black")}>
                  Total projects
                </span>
                <button
                  title="See more"
                  className={clsx(
                    "flex cursor-pointer items-center justify-center rounded-full bg-white p-1",
                    "border border-gray-500"
                  )}
                  onClick={() => navigate("/userProjects")}
                >
                  <ArrowUpRightIcon className="text-gray-500" />
                </button>
              </div>
              <div className={clsx("flex items-baseline justify-start gap-2")}>
                <span
                  className={clsx("text-left text-2xl font-bold text-black")}
                >
                  {projects?.length}
                </span>
                <span className={clsx("text-left text-xs text-gray-500")}>
                  projects
                </span>
              </div>
            </div>

            <div
              className={clsx(
                "flex h-24 w-full flex-col justify-between gap-2",
                "rounded-md border border-gray-300 bg-white p-3"
              )}
            >
              <div className={clsx("flex items-center justify-between")}>
                <span className={clsx("text-sm text-black")}>
                  Active projects
                </span>
                <button
                  title="See more"
                  className={clsx(
                    "flex cursor-pointer items-center justify-center rounded-full bg-white p-1",
                    "border border-gray-500"
                  )}
                  onClick={() => navigate("/userProjects")}
                >
                  <ArrowUpRightIcon className="text-gray-500" />
                </button>
              </div>
              <div className={clsx("flex items-baseline justify-start gap-2")}>
                <span
                  className={clsx("text-left text-2xl font-bold text-black")}
                >
                  {
                    projects?.filter(
                      (project: Project) => project.status === "ACTIVE"
                    ).length
                  }
                </span>
                <span className={clsx("text-left text-xs text-gray-500")}>
                  On going projects
                </span>
              </div>
            </div>

            <div
              className={clsx(
                "flex h-24 w-full flex-col justify-between gap-2",
                "rounded-md border border-gray-300 bg-white p-3"
              )}
            >
              <div className={clsx("flex items-center justify-between")}>
                <span className={clsx("text-sm text-black")}>
                  Ended projects
                </span>
                <button
                  title="See more"
                  className={clsx(
                    "flex cursor-pointer items-center justify-center rounded-full bg-white p-1",
                    "border border-gray-500"
                  )}
                  onClick={() => navigate("/userProjects")}
                >
                  <ArrowUpRightIcon className="text-gray-500" />
                </button>
              </div>
              <div className={clsx("flex items-baseline justify-start gap-2")}>
                <span
                  className={clsx("text-left text-2xl font-bold text-black")}
                >
                  {
                    projects?.filter(
                      (project: Project) => project.status === "COMPLETED"
                    ).length
                  }
                </span>
                <span className={clsx("text-left text-xs text-gray-500")}>
                  completed projects
                </span>
              </div>
            </div>

            <div
              className={clsx(
                "flex h-24 w-full flex-col justify-between gap-2",
                "rounded-md border border-gray-300 bg-white p-3"
              )}
            >
              <div className={clsx("flex items-center justify-between")}>
                <span className={clsx("text-sm text-black")}>
                  Pending projects
                </span>
                <button
                  title="See more"
                  className={clsx(
                    "flex cursor-pointer items-center justify-center rounded-full bg-white p-1",
                    "border border-gray-500"
                  )}
                  onClick={() => navigate("/userProjects")}
                >
                  <ArrowUpRightIcon className="text-gray-500" />
                </button>
              </div>
              <div className={clsx("flex items-baseline justify-start gap-2")}>
                <span
                  className={clsx("text-left text-2xl font-bold text-black")}
                >
                  {
                    projects?.filter(
                      (project: Project) =>
                        project.status === "PLANNING" ||
                        project.status === "PAUSED"
                    ).length
                  }
                </span>
                <span className={clsx("text-left text-xs text-gray-500")}>
                  projects on discuss
                </span>
              </div>
            </div>
          </div>

          {/**Tasks snapshots */}
          <div
            className={clsx(
              "grid w-full grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6"
            )}
          >
            <div
              className={clsx(
                "flex h-24 w-full flex-col justify-between gap-2",
                "rounded-md border border-gray-300 bg-white p-3"
              )}
            >
              <div className={clsx("flex items-center justify-between")}>
                <span className={clsx("text-sm text-black")}>Total tasks</span>
                <button
                  title="See more"
                  className={clsx(
                    "flex cursor-pointer items-center justify-center rounded-full bg-white p-1",
                    "border border-gray-500"
                  )}
                  onClick={() => navigate("/userTasks")}
                >
                  <ArrowUpRightIcon className="text-gray-500" />
                </button>
              </div>
              <div className={clsx("flex items-baseline justify-start gap-2")}>
                <span
                  className={clsx("text-left text-2xl font-bold text-black")}
                >
                  {tasks?.data.length}
                </span>
                <span className={clsx("text-left text-xs text-gray-500")}>
                  tasks
                </span>
              </div>
            </div>

            <div
              className={clsx(
                "flex h-24 w-full flex-col justify-between gap-2",
                "rounded-md border border-gray-300 bg-white p-3"
              )}
            >
              <div className={clsx("flex items-center justify-between")}>
                <span className={clsx("text-sm text-black")}>In progress</span>
                <button
                  title="See more"
                  className={clsx(
                    "flex cursor-pointer items-center justify-center rounded-full bg-white p-1",
                    "border border-gray-500"
                  )}
                  onClick={() => navigate("/userTasks")}
                >
                  <ArrowUpRightIcon className="text-gray-500" />
                </button>
              </div>
              <div className={clsx("flex items-baseline justify-start gap-2")}>
                <span
                  className={clsx("text-left text-2xl font-bold text-black")}
                >
                  {
                    tasks?.data.filter(
                      (task: Task) => task.status === "IN_PROGRESS"
                    ).length
                  }
                </span>
                <span className={clsx("text-left text-xs text-gray-500")}>
                  On going tasks
                </span>
              </div>
            </div>

            <div
              className={clsx(
                "flex h-24 w-full flex-col justify-between gap-2",
                "rounded-md border border-gray-300 bg-white p-3"
              )}
            >
              <div className={clsx("flex items-center justify-between")}>
                <span className={clsx("text-sm text-black")}>Ended tasks</span>
                <button
                  title="See more"
                  className={clsx(
                    "flex cursor-pointer items-center justify-center rounded-full bg-white p-1",
                    "border border-gray-500"
                  )}
                  onClick={() => navigate("/userTasks")}
                >
                  <ArrowUpRightIcon className="text-gray-500" />
                </button>
              </div>
              <div className={clsx("flex items-baseline justify-start gap-2")}>
                <span
                  className={clsx("text-left text-2xl font-bold text-black")}
                >
                  {
                    tasks?.data.filter(
                      (task: Task) => task.status === "COMPLETED"
                    ).length
                  }
                </span>
                <span className={clsx("text-left text-xs text-gray-500")}>
                  completed tasks
                </span>
              </div>
            </div>

            <div
              className={clsx(
                "flex h-24 w-full flex-col justify-between gap-2",
                "rounded-md border border-gray-300 bg-white p-3"
              )}
            >
              <div className={clsx("flex items-center justify-between")}>
                <span className={clsx("text-sm text-black")}>
                  Pending tasks
                </span>
                <button
                  title="See more"
                  className={clsx(
                    "flex cursor-pointer items-center justify-center rounded-full bg-white p-1",
                    "border border-gray-500"
                  )}
                  onClick={() => navigate("/userTasks")}
                >
                  <ArrowUpRightIcon className="text-gray-500" />
                </button>
              </div>
              <div className={clsx("flex items-baseline justify-start gap-2")}>
                <span
                  className={clsx("text-left text-2xl font-bold text-black")}
                >
                  {
                    tasks?.data.filter((task: Task) => task.status === "TODO")
                      .length
                  }
                </span>
                <span className={clsx("text-left text-xs text-gray-500")}>
                  tasks to do
                </span>
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
                  "grid w-full grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4"
                )}
              >
                {tasks?.data.length > 0 ? (
                  <>
                    {tasks?.data.slice(0, 2).map((task: TaskWithRelations) => (
                      <TaskDashboardCard
                        task={task}
                        onclick={() => navigate("/userTasks")}
                      />
                    ))}
                  </>
                ) : (
                  <div>No tasks</div>
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
                <Chart
                  type="doughnut"
                  data={data}
                  options={options}
                  className="w-64"
                />
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
