import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import {
  Eventcalendar,
  setOptions,
  MbscEventcalendarView,
} from "@mobiscroll/react";
import { useMemo, useState } from "react";
import { taskToEvent, projectToEvent } from "../../utils/calendarUtils";
import { TaskWithRelations } from "../../types/Task";
import { Project } from "../../types/Project";
import { clsx } from "clsx";
import { ProgressSpinner } from "primereact/progressspinner";

setOptions({
  theme: "material",
  themeVariant: "auto",
});

/**
 * Propriété du Calendar
 *
 * - tasks: la liste des tâches à afficher dans le calendrier
 * - projects: la liste des projets à afficher dans le calendrier
 */
type CalendarProps = {
  tasks: TaskWithRelations[];
  projects: Project[];
};

/**
 * Affiche la liste des projets et des tâches de l'utilisateur dans un calendrier
 *
 * @param {CalendarProps} param0 - Propriété du Calendar
 */
export default function Calendar({ tasks, projects }: CalendarProps) {
  const [isLoading, setIsLoading] = useState(true);
  const projectEvents = useMemo(() => projects.map(projectToEvent), [projects]);
  const taskEvents = useMemo(() => tasks.map(taskToEvent), [tasks]);
  const events = [...projectEvents, ...taskEvents];
  const view = useMemo<MbscEventcalendarView>(
    () => ({
      calendar: { labels: 3 },
    }),
    []
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
        view={view}
        data={events}
        className={clsx("rounded-md border border-gray-300")}
        onPageLoaded={() => setIsLoading(false)}
      />
    </div>
  );
}
