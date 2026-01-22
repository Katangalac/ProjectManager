import { clsx } from "clsx";
import { cn } from "@/lib/utils";
import { TaskWithRelations } from "@/types/Task";
import { Progress } from "../ui/progress";
import { priorityLevelHelper } from "@/utils/priorityLevelHelper";
import TaskActionMenu from "./TaskActionMenu";
import {
  CalendarCheckIcon,
  CalendarPlusIcon,
  CalendarXIcon,
} from "@phosphor-icons/react";
import { dateToLongString } from "@/utils/dateUtils";

type TaskDashboardCardProps = {
  task: TaskWithRelations;
  className?: string;
  onclick?: () => void;
};

/**
 * Affiche une tache dans une carte
 */
export default function TaskDashboardCard({
  task,
  className,
  onclick,
}: TaskDashboardCardProps) {
  const isOverdue =
    task.status !== "COMPLETED" && new Date(task.deadline) < new Date();
  return (
    <div
      className={cn(
        "relative flex h-full w-full max-w-76 flex-col justify-between gap-2 px-2 py-2",
        "rounded-md border border-gray-200 bg-sky-50",
        onclick ? "cursor-pointer" : "",
        className
      )}
    >
      <div className="absolute inset-0 bg-transparent" onClick={onclick} />
      <div className={clsx("flex flex-1 flex-col gap-1")}>
        <div className={clsx("flex w-full items-center justify-between gap-3")}>
          <div className={clsx("mb-2 flex items-center justify-start gap-2")}>
            <span
              className={clsx(
                "h-fit w-fit rounded-sm px-2 py-1 text-xs font-medium",
                "border border-gray-300",
                priorityLevelHelper[task.priorityLevel].bgColor,
                priorityLevelHelper[task.priorityLevel].textStyle
              )}
            >
              {priorityLevelHelper[task.priorityLevel].label}
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
            <TaskActionMenu task={task} />
          </div>
        </div>

        <div className={clsx("flex flex-col items-start gap-2")}>
          <span className={clsx("text-left text-xs font-medium text-black")}>
            {task.title}
          </span>
          <p
            className={clsx(
              "h-20 max-h-20 overflow-x-auto text-left text-xs text-gray-600",
              "[&::-webkit-scrollbar]:w-0.5",
              "[&::-webkit-scrollbar-track]:bg-gray-300",
              "[&::-webkit-scrollbar-thumb]:bg-gray-400"
            )}
          >
            {task.description}
          </p>
        </div>
      </div>
      <div
        className={clsx(
          "flex flex-1 flex-col justify-end gap-2",
          "border-t border-dotted border-gray-400"
        )}
      >
        <span
          className={clsx(
            "flex items-center gap-1 text-left text-xs text-gray-600"
          )}
        >
          <CalendarPlusIcon weight="regular" className="size-4.5 stroke-1" />{" "}
          {dateToLongString(new Date(task.startedAt))}
        </span>
        {task.status === "COMPLETED" && task.completedAt ? (
          <span
            className={clsx(
              "flex items-center gap-1 text-left text-xs text-green-600"
            )}
          >
            <CalendarCheckIcon
              weight="regular"
              className="size-4.5 text-green-600"
            />{" "}
            {dateToLongString(new Date(task.completedAt))}
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
            {dateToLongString(new Date(task.deadline))}
          </span>
        )}

        <div className={clsx("flex w-full flex-col gap-1")}>
          <Progress
            value={task.progress}
            className={clsx("h-1.5 [&>div]:bg-sky-500")}
          />
          <span className={clsx("text-left text-xs font-medium text-black")}>
            {task.progress}% completed
          </span>
        </div>
      </div>
    </div>
  );
}
