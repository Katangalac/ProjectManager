import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import {
  Eventcalendar,
  setOptions,
  MbscEventcalendarView,
  Popup,
  MbscPopupOptions,
  MbscResponsiveOptions,
  MbscCalendarEvent,
} from "@mobiscroll/react";
import { Event } from "../../utils/calendarUtils";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { taskToEvent, projectToEvent } from "../../utils/calendarUtils";
import { TaskWithRelations } from "../../types/Task";
import { Project } from "../../types/Project";
import { clsx } from "clsx";
import { ProgressSpinner } from "primereact/progressspinner";
import { dateToLongString } from "@/utils/dateUtils";
import { Progress } from "../ui/progress";
import UserProfilePhoto from "../profile/UserProfilePhoto";
import { User } from "@/types/User";
import {
  CalendarPlusIcon,
  CalendarCheckIcon,
  CalendarXIcon,
  UsersIcon,
} from "@phosphor-icons/react";

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

  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState<ReactNode | null>(null);
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement>();

  const popupResponsive: MbscResponsiveOptions<MbscPopupOptions> = useMemo(
    () => ({
      medium: {
        display: "anchored",
        width: 400,
        fullScreen: false,
        touchUi: false,
      },
    }),
    []
  );

  const handleEventClick = useCallback((args: MbscCalendarEvent) => {
    console.log(args.event);
    const event: Event = args.event;
    setPopupAnchor(args.domEvent.target);
    setPopupContent(
      <div className="p-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold underline underline-offset-3">
            {event.original.title}
          </span>
          <div className="flex gap-2">
            <p
              className={clsx(
                "max-h-20 overflow-y-visible text-left text-sm text-gray-600",
                "[&::-webkit-scrollbar]:w-0.5",
                "[&::-webkit-scrollbar-track]:bg-gray-300",
                "[&::-webkit-scrollbar-thumb]:bg-gray-400"
              )}
            >
              "{event.original.description}"
            </p>
          </div>
          {event.original && event.original.assignedTo && (
            <>
              {event.original.assignedTo.length > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-2 text-sm text-gray-600">
                    <UsersIcon
                      weight="fill"
                      size={20}
                      className={clsx("text-sm text-gray-500")}
                    />{" "}
                    Assignees{" "}
                  </span>
                  <div>
                    {event.original.assignedTo.map((a: { user: User }) => (
                      <UserProfilePhoto
                        key={a.user.id}
                        userId={a.user.id}
                        imageUrl={a.user.imageUrl}
                        username={a.user.userName}
                        email={a.user.email}
                        className="ring-1 ring-white"
                        imagefallback={
                          a.user.firstName && a.user.lastName
                            ? `${a.user.firstName[0].toUpperCase() + a.user.lastName[0].toUpperCase()}`
                            : undefined
                        }
                        imageClassName="text-[10px] size-10"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <span className="text-sm text-gray-500 italic">
                  "Unassigned"
                </span>
              )}
            </>
          )}

          {event.start && (
            <div className="flex gap-2">
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarPlusIcon
                  weight="duotone"
                  size={20}
                  className={clsx("text-gray-500")}
                />{" "}
                Started on {dateToLongString(new Date(event.start))}
              </span>
            </div>
          )}
          {event.original.status === "COMPLETED" ? (
            <div className="flex gap-2">
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarCheckIcon
                  weight="duotone"
                  size={20}
                  className={clsx("text-gray-500")}
                />{" "}
                Completed on {event.completedAt}
              </span>
            </div>
          ) : (
            <>
              {event.end && (
                <div className="flex gap-2">
                  <span className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarXIcon
                      weight="duotone"
                      size={20}
                      className={clsx("text-gray-500")}
                    />{" "}
                    Deadline on {dateToLongString(new Date(event.end))}
                  </span>
                </div>
              )}
            </>
          )}
          <div className="flex flex-col gap-1">
            <Progress
              value={event.original.progress}
              className={clsx("h-1.5 [&>div]:bg-sky-500")}
            />
            <span className="text-sm font-medium">
              {event.original.progress}% Completed
            </span>
          </div>
        </div>
      </div>
    );
    setOpenPopup(true);
  }, []);

  return (
    <div className={clsx("min-h-screen")}>
      {isLoading && (
        <div className={clsx("flex min-h-screen items-center justify-center")}>
          <ProgressSpinner className="sm:h-10 lg:h-15" strokeWidth="4" />
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
        onEventClick={handleEventClick}
        onPageLoaded={() => setIsLoading(false)}
      />
      <Popup
        display="bottom"
        fullScreen={true}
        contentPadding={false}
        anchor={popupAnchor}
        isOpen={openPopup}
        onClose={() => setOpenPopup(false)}
        responsive={popupResponsive}
      >
        {popupContent}
      </Popup>
    </div>
  );
}
