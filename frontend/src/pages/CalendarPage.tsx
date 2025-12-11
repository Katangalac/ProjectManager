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

/**
 * Affiche les tâches et projets d'un utilisateurs dans un calendrier ou un scheduler
 */
export default function CalendarPage() {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useTasks({ all: true });
  const {
    data: projects = [],
    isLoading: projectsLoading,
    isError: projectsError,
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

  if (tasksLoading || projectsLoading) return <ProgressSpinner />;
  if (tasksError) return <div>An error occur while loading user tasks</div>;
  if (projectsError)
    return <div>An error occur while loading user projects</div>;

  return (
    <div className={clsx("flex flex-col gap-2")}>
      <div className={clsx("w-fit")}>
        <InlineSelector
          value={viewMode}
          options={viewModeOptions}
          onChange={setViewMode}
        />
      </div>

      {viewMode === "calendar" && !projectsLoading && !tasksLoading && (
        <Calendar tasks={tasks?.data || []} projects={projects} />
      )}
      {viewMode === "scheduler" && !projectsLoading && !tasksLoading && (
        <Scheduler tasks={tasks?.data || []} projects={projects} />
      )}
    </div>
  );
}
