import { clsx } from "clsx";
import { TaskWithRelations } from "@/types/Task";
import { Progress } from "../ui/progress";
import { priorityLevelHelper } from "@/utils/priorityLevelHelper";

type TaskDashboardCardProps = {
  task: TaskWithRelations;
  onclick?: () => void;
};

/**
 * Affiche une tache dans une carte
 */
export default function TaskDashboardCard({
  task,
  onclick,
}: TaskDashboardCardProps) {
  const isOverdue =
    task.status !== "COMPLETED" && new Date(task.deadline) < new Date();
  return (
    <div
      className={clsx(
        "flex h-full w-full flex-col justify-between gap-2 px-3 py-4",
        "rounded-md border border-gray-200 bg-sky-50",
        onclick ? "cursor-pointer" : ""
      )}
      onClick={onclick}
    >
      <div className={clsx("flex flex-1 flex-col gap-1")}>
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
        <div className={clsx("flex flex-col items-start gap-1")}>
          <span className={clsx("text-left text-xs font-medium text-black")}>
            {task.title}
          </span>
          <p
            className={clsx(
              "max-h-20 overflow-x-auto text-left text-xs text-gray-600",
              "[&::-webkit-scrollbar]:w-0.5",
              "[&::-webkit-scrollbar-track]:bg-gray-300",
              "[&::-webkit-scrollbar-thumb]:bg-gray-400"
            )}
          >
            {task.description}
          </p>
        </div>
      </div>
      <div className={clsx("flex flex-1 flex-col justify-end gap-1")}>
        {/* <span className={clsx("mb-1 text-left text-xs text-black")}>
          Due to {new Date(task.deadline).toISOString().split("T")[0]}{" "}
          {isOverdue && <strong className="text-red-700">Overdue!</strong>}
        </span> */}
        <Progress
          value={task.progress}
          className={clsx("h-1.5 [&>div]:bg-sky-500")}
        />
        <span className={clsx("text-left text-xs font-medium text-black")}>
          Progress {task.progress}%
        </span>
      </div>
    </div>
  );
}
