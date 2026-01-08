import Scheduler from "../components/calendar/Scheduler";
import Calendar from "../components/calendar/Calendar";
import { InlineSelector } from "../components/commons/InlineSelector";
import { useState } from "react";
import { useTasks } from "../hooks/queries/task/useTasks";
import { useProjects } from "../hooks/queries/project/useProjects";
import {
  CalendarIcon,
  CalendarDateRangeIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { ProgressSpinner } from "primereact/progressspinner";
import UserErrorMessage from "@/components/commons/UserErrorMessage";

/**
 * Affiche les tâches et projets d'un utilisateurs dans un calendrier ou un scheduler
 */
export default function CalendarPage() {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
    refetch: refetchTasks,
  } = useTasks({ all: true });
  const {
    data: projects = [],
    isLoading: projectsLoading,
    isError: projectsError,
    refetch: refetchProjects,
  } = useProjects({ all: true });

  const [viewMode, setViewMode] = useState<"calendar" | "scheduler">(
    "calendar"
  );
  const viewModeOptions = [
    {
      label: "Calendar",
      value: "calendar",
      icon: <CalendarIcon className={clsx("size-4")} />,
    },
    {
      label: "Scheduler",
      value: "scheduler",
      icon: <CalendarDateRangeIcon className={clsx("size-4 stroke-2")} />,
    },
  ];

  return (
    <div
      className={clsx(
        "flex h-full w-full flex-col items-center justify-center gap-2 p-5"
      )}
    >
      {(projectsLoading || tasksLoading) && <ProgressSpinner />}
      {!(projectsLoading || tasksLoading) && (
        <div className={clsx("flex h-full w-full flex-col gap-4")}>
          <div className={clsx("w-fit")}>
            <InlineSelector
              value={viewMode}
              options={viewModeOptions}
              onChange={setViewMode}
            />
          </div>

          <div
            className={clsx(
              "flex flex-1 flex-col justify-between gap-4 pb-4",
              (projectsError || tasksError) && "justify-start gap-10"
            )}
          >
            {(projectsError || tasksError) && (
              <UserErrorMessage
                onRetryButtonClick={() => {
                  refetchTasks();
                  refetchProjects();
                }}
              />
            )}
            {viewMode === "calendar" && !projectsLoading && !tasksLoading && (
              <Calendar tasks={tasks?.data || []} projects={projects} />
            )}
            {viewMode === "scheduler" && !projectsLoading && !tasksLoading && (
              <Scheduler tasks={tasks?.data || []} projects={projects} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
