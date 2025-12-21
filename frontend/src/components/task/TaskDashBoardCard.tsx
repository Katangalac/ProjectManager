import { clsx } from "clsx";
import { TaskWithRelations } from "@/types/Task";
import { Progress } from "../ui/progress";
import { priorityLevelHelper } from "@/utils/priorityLevelHelper";
import { dateToLongString } from "@/utils/dateUtils";

type TaskDashboardCardProps = {
  task: TaskWithRelations;
};

export default function TaskDashboardCard({ task }: TaskDashboardCardProps) {
  const isOverdue =
    task.status !== "COMPLETED" && new Date(task.deadline) < new Date();
  return (
    <div
      className={clsx(
        "flex flex-col gap-2 p-3 lg:w-70",
        "rounded-md border border-gray-100 bg-sky-50"
      )}
    >
      <span
        className={clsx(
          "mb-1 h-fit w-fit rounded-sm px-2 py-1 text-xs font-medium",
          priorityLevelHelper[task.priorityLevel].bgColor,
          priorityLevelHelper[task.priorityLevel].textStyle
        )}
      >
        {priorityLevelHelper[task.priorityLevel].label}
      </span>
      <div className={clsx("flex h-20 flex-col items-start gap-1")}>
        <span className={clsx("text-left text-xs font-medium text-black")}>
          {task.title}
        </span>
        <p
          className={clsx(
            "overflow-x-auto text-left text-xs text-gray-600",
            "[&::-webkit-scrollbar]:w-0.5",
            "[&::-webkit-scrollbar-track]:bg-gray-300",
            "[&::-webkit-scrollbar-thumb]:bg-gray-400"
          )}
        >
          {task.description}
        </p>
      </div>
      <div className={clsx("mt-2 flex flex-col gap-1")}>
        {/* <span className={clsx("mb-1 text-left text-xs text-black")}>
          Due to {new Date(task.deadline).toISOString().split("T")[0]}{" "}
          {isOverdue && <strong className="text-red-700">Overdue!</strong>}
        </span> */}
        <Progress
          value={task.progress}
          className={clsx("h-1.5 [&>div]:bg-green-300")}
        />
        <span className={clsx("text-left text-xs font-medium text-black")}>
          Progress {task.progress}%
        </span>
      </div>
    </div>
  );
}
