import { Project } from "@/types/Project";
import { clsx } from "clsx";
import { Progress } from "../ui/progress";
import { PROJECT_STATUS_META } from "@/lib/constants/project";
import ProjectActionMenu from "./ProjectActionMenu";
import {
  CalendarPlusIcon,
  CalendarXIcon,
  CalendarCheckIcon,
} from "@phosphor-icons/react";
import { dateToLongString } from "@/utils/dateUtils";
import { useNavigate } from "react-router-dom";
/**
 * Propriétés du ProjectCard
 *
 *  - project: le projet à afficher sur la carte
 */
type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();
  const isOverdue =
    project.status !== "COMPLETED" && new Date(project.deadline) < new Date();
  return (
    <div
      className={clsx(
        "relative h-fit w-full max-w-76 cursor-pointer px-2",
        "rounded-md border border-gray-300 shadow-lg"
      )}
    >
      <div
        className="absolute inset-0 bg-transparent"
        onClick={() => navigate(`${project.id}`)}
      />

      <div className={clsx("flex w-full flex-col gap-2")}>
        <div
          className={clsx(
            "flex w-full items-center justify-between gap-3 py-2"
          )}
        >
          <div className={clsx("flex items-center gap-2")}>
            <span
              className={clsx(
                "w-fit rounded-sm border px-2 py-1",
                "text-xs font-medium",
                PROJECT_STATUS_META[project.status].bgColor,
                PROJECT_STATUS_META[project.status].borderColor,
                PROJECT_STATUS_META[project.status].textColor
              )}
            >
              {PROJECT_STATUS_META[project.status].label}
            </span>
            {isOverdue && (
              <span
                className={clsx(
                  "px-2 py-1",
                  "rounded-sm border border-gray-300 bg-red-100",
                  "text-xs font-medium text-red-600"
                )}
              >
                Overdue!
              </span>
            )}
          </div>
          <div className="relative z-10">
            <ProjectActionMenu project={project} />
          </div>
        </div>
        <div className={clsx("flex flex-col items-start gap-2")}>
          <span
            className={clsx(
              "truncate text-left text-xs font-medium text-black",
              "dark:text-white"
            )}
            title={project.title}
          >
            {project.title}
          </span>
          <p
            className={clsx(
              "h-20 overflow-x-auto text-left text-xs text-gray-600",
              "[&::-webkit-scrollbar]:w-0.5",
              "[&::-webkit-scrollbar-track]:bg-gray-300",
              "[&::-webkit-scrollbar-thumb]:bg-gray-400"
            )}
          >
            {project.description}
          </p>
          <div
            className={clsx(
              "flex w-full flex-col items-start gap-2 py-2",
              "border-t border-dotted border-gray-400"
            )}
          >
            <span
              className={clsx(
                "flex items-center gap-1 text-left text-xs text-gray-600"
              )}
            >
              <CalendarPlusIcon
                weight="regular"
                className="size-4.5 stroke-1"
              />{" "}
              {dateToLongString(new Date(project.startedAt))}
            </span>
            {project.status === "COMPLETED" && project.completedAt ? (
              <span
                className={clsx(
                  "flex items-center gap-1 text-left text-xs text-gray-600"
                )}
              >
                <CalendarCheckIcon
                  weight="regular"
                  className="size-4.5 text-green-600"
                />{" "}
                {dateToLongString(new Date(project.completedAt))}
              </span>
            ) : (
              <span
                className={clsx(
                  "flex items-center gap-1 text-left text-xs text-gray-600"
                )}
              >
                <CalendarXIcon
                  weight="regular"
                  className={clsx(
                    "size-4.5",
                    isOverdue ? "text-red-600" : "text-gray-600"
                  )}
                />{" "}
                {dateToLongString(new Date(project.deadline))}
              </span>
            )}
            <div className={clsx("flex w-full flex-col gap-1")}>
              <span
                className={clsx("text-left text-xs font-medium text-black")}
              >
                {project.progress}% completed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
