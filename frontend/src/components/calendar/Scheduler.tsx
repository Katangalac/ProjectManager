import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import { Eventcalendar, setOptions } from "@mobiscroll/react";
import { useMemo, useState } from "react";
import {
  taskToEvent,
  projectToEvent,
  mapProjectsAndTasksToResources,
} from "../../utils/calendarUtils";
import { TaskWithRelations } from "../../types/Task";
import { Project } from "../../types/Project";
import { clsx } from "clsx";
import { ProgressSpinner } from "primereact/progressspinner";

setOptions({
  theme: "material",
  themeVariant: "auto",
});

/**
 * Propriété du Scheduler
 *
 * - tasks: la liste des tâches à afficher dans le scheduler
 * - projects: la liste des projets à afficher dans le scheduler
 */
type SchedulerProps = {
  tasks: TaskWithRelations[];
  projects: Project[];
};

/**
 * Affiche la liste des projets et des tâches de l'utilisateur dans un scheduler de type timeline view
 *
 * @param {SchedulerProps} param0 - Propriété du Scheduler
 */
export default function Scheduler({ tasks, projects }: SchedulerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const myView = useMemo(
    () => ({
      timeline: {
        type: "month" as const,
      },
    }),
    []
  );
  const projectEvents = useMemo(() => projects.map(projectToEvent), [projects]);
  const taskEvents = useMemo(() => tasks.map(taskToEvent), [tasks]);
  const events = [...projectEvents, ...taskEvents];
  const resources = useMemo(
    () => mapProjectsAndTasksToResources(tasks, projects),
    [tasks, projects]
  );

  return (
    <div className={clsx("min-h-screen")}>
      {isLoading && (
        <div className={clsx("flex min-h-screen items-center justify-center")}>
          <ProgressSpinner strokeWidth="5" animationDuration=".5s" />
        </div>
      )}
      <Eventcalendar
        clickToCreate={false}
        dragToCreate={false}
        dragToMove={false}
        dragToResize={false}
        eventDelete={false}
        view={myView}
        data={events}
        resources={resources}
        className={clsx("rounded-md border border-gray-300")}
        onPageLoaded={() => setIsLoading(false)}
      />
    </div>
  );
}
