import { clsx } from "clsx";
import { userStore } from "../stores/userStore";
import { useTasks } from "../hooks/queries/task/useTasks";
import { useProjects } from "../hooks/queries/project/useProjects";
import { ProgressSpinner } from "primereact/progressspinner";
import { Task } from "@/types/Task";
import TaskDashboardCard from "@/components/task/TaskDashBoardCard";
import { Chart } from "primereact/chart";
import { getTaskStats, getProjectStats } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import DashboardStatsCard from "@/components/dashboard/DashboardStatsCard";
import NoItems from "@/components/commons/NoItems";
import UserErrorMessage from "@/components/commons/UserErrorMessage";
import ProjectCard from "@/components/project/ProjectCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useMemo } from "react";
import MotionPage from "@/components/commons/MotionPage";
import {
  ClipboardCheck,
  ClipboardClock,
  ClipboardList,
  FolderOpen,
} from "lucide-react";

/**
 * Tableau de bord de l'application
 * Affiche les nombres de projets et taches ainsi que des statistiques
 * Affiche les 2 taches qui arrivent à leur échéance prochainement
 */
export default function DashBoard() {
  const { user } = userStore();
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

  const filteredProjects = projects
    ? projects.data.filter((project) => project.status !== "COMPLETED")
    : [];
  const filteredTasks = tasks
    ? tasks.data.filter((task) => task.status !== "COMPLETED")
    : [];

  const taskStats = useMemo(() => {
    return getTaskStats(tasks?.data ?? []);
  }, [tasks?.data]);
  const projectStats = useMemo(() => {
    return getProjectStats(projects?.data ?? []);
  }, [projects?.data]);

  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [taskData, setTaskData] = useState({});
  const [projectData, setProjectData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  //Données pour le chart des taches
  useEffect(() => {
    setTaskData({
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
    });
  }, [taskStats]);

  //Données pour le chart des projets
  useEffect(() => {
    setProjectData({
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
    });
  }, [projectStats]);

  //Données pour lees options des charts
  useEffect(() => {
    setChartOptions({
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
          },
        },
      },
    });
  }, []);

  return (
    <MotionPage>
      <div
        className={clsx(
          "flex h-full items-center justify-center pb-4",
          (tasksError || projectsError) && "flex-col gap-4"
        )}
      >
        {(tasksError || projectsError) && <UserErrorMessage />}

        {tasksLoading || projectsLoading ? (
          <div className="mb-10 flex h-full w-full items-center justify-center">
            <ProgressSpinner className="sm:h-10 lg:h-15" strokeWidth="4" />
          </div>
        ) : (
          <div
            className={clsx(
              "flex h-full w-full flex-1 flex-col items-start justify-start gap-4 p-4",
              "bg-white",
              "dark:bg-gray-900"
            )}
          >
            <span className={clsx("text-sm text-gray-500")}>
              Hi <strong className="text-black">{user?.userName}</strong>! Plan,
              prioritize and accomplish your tasks and projects with ease.
            </span>

            {/**Tasks and projects snapshots */}
            <div
              className={clsx(
                "grid w-full grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6"
              )}
            >
              <DashboardStatsCard
                title="Total projects"
                className="border-purple-500"
                value={projects?.data.length ?? 0}
                description="Projects"
                icon={
                  <FolderOpen className="size-10 stroke-[2px] text-purple-600 opacity-20" />
                }
                onSeeMore={() => navigate("/userProjects")}
              />

              <DashboardStatsCard
                title="Total tasks"
                className="border-sky-500"
                icon={
                  <ClipboardList className="size-10 stroke-[2px] text-sky-500 opacity-20" />
                }
                value={tasks?.data.length ?? 0}
                description="Tasks"
                onSeeMore={() => navigate("/userTasks")}
              />

              <DashboardStatsCard
                title="Pending tasks"
                className="border-yellow-500"
                icon={
                  <ClipboardClock className="size-10 stroke-[2px] text-yellow-600 opacity-20" />
                }
                value={
                  tasks?.data.filter((task: Task) => task.status === "TODO")
                    .length ?? 0
                }
                description="Tasks to do"
                onSeeMore={() => navigate("/userTasks")}
              />

              <DashboardStatsCard
                title="Ended tasks"
                className="border-green-500"
                icon={
                  <ClipboardCheck className="size-10 stroke-[2px] text-green-500 opacity-20" />
                }
                value={
                  tasks?.data.filter(
                    (task: Task) => task.status === "COMPLETED"
                  ).length ?? 0
                }
                description="Ended tasks"
                onSeeMore={() => navigate("/userTasks")}
              />
            </div>

            <div
              className={clsx(
                "flex w-full flex-col items-stretch gap-6 sm:flex-col md:flex-row lg:flex-row"
              )}
            >
              <div
                className={clsx(
                  "flex flex-1 flex-col justify-start gap-2",
                  "rounded-md border border-gray-300 p-3"
                )}
              >
                <div
                  className={clsx("flex w-full items-center justify-between")}
                >
                  <span
                    className={clsx(
                      "mb-2 text-left text-sm font-medium text-gray-600"
                    )}
                  >
                    Upcoming projects
                  </span>
                  <div className={clsx("flex gap-2")}>
                    <button
                      disabled={currentProjectIndex === 0}
                      onClick={() =>
                        setCurrentProjectIndex(currentProjectIndex - 1)
                      }
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
                      disabled={
                        currentProjectIndex >= filteredProjects.length - 1
                      }
                      onClick={() =>
                        setCurrentProjectIndex(currentProjectIndex + 1)
                      }
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
                    "h-full w-full",
                    !(filteredProjects.length > 0) &&
                      "flex items-center justify-center"
                  )}
                >
                  {filteredProjects.length > 0 ? (
                    <>
                      <ProjectCard
                        project={filteredProjects[currentProjectIndex]}
                        showProgressBar={true}
                        className="w-full max-w-full border-gray-200 shadow-none"
                      />
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
                <span
                  className={clsx(
                    "text-left text-sm font-medium text-gray-600"
                  )}
                >
                  Project stats
                </span>
                <div
                  className={clsx("flex h-full items-center justify-center")}
                >
                  {projects && projects.data.length > 0 ? (
                    <Chart
                      type="pie"
                      data={projectData}
                      options={chartOptions}
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
                "flex w-full flex-col items-stretch gap-6 sm:flex-col md:flex-row lg:flex-row"
              )}
            >
              <div
                className={clsx(
                  "flex flex-1 flex-col justify-start gap-2",
                  "rounded-md border border-gray-300 p-3"
                )}
              >
                <div
                  className={clsx("flex w-full items-center justify-between")}
                >
                  <span
                    className={clsx(
                      "mb-2 text-left text-sm font-medium text-gray-600"
                    )}
                  >
                    Upcoming tasks
                  </span>
                  <div className={clsx("flex gap-2")}>
                    <button
                      disabled={currentTaskIndex === 0}
                      onClick={() => setCurrentTaskIndex(currentTaskIndex - 1)}
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
                      disabled={currentTaskIndex >= filteredTasks.length - 1}
                      onClick={() => setCurrentTaskIndex(currentTaskIndex + 1)}
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
                    "h-full w-full",
                    !(filteredTasks.length > 0) &&
                      "flex items-center justify-center"
                  )}
                >
                  {filteredTasks.length > 0 ? (
                    <>
                      <TaskDashboardCard
                        task={filteredTasks[currentTaskIndex]}
                        className="w-full max-w-full border-gray-200 bg-white"
                        onclick={() => navigate("/userTasks")}
                      />
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
                <span
                  className={clsx(
                    "text-left text-sm font-medium text-gray-600"
                  )}
                >
                  Tasks stats
                </span>
                <div
                  className={clsx("flex h-full items-center justify-center")}
                >
                  {tasks && tasks.data.length > 0 ? (
                    <Chart
                      type="pie"
                      data={taskData}
                      options={chartOptions}
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
            <div className="text-white">A retirer</div>
          </div>
        )}
      </div>
    </MotionPage>
  );
}
