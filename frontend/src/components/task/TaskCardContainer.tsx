import { clsx } from "clsx";
import { TaskStatus } from "../../types/Task";
import { TaskWithRelations } from "../../types/Task";
import TaskCard from "./TaskCard";
import { TASK_STATUS_META } from "../../lib/constants/task";

import {
  EllipsisHorizontalIcon,
  PlusIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";

export type TaskCardContainerProps = {
  status: TaskStatus;
  tasks: TaskWithRelations[];
};

export default function TaskCardContainer({
  status,
  tasks,
}: TaskCardContainerProps) {
  const {
    label,
    textColor,
    bgColor,
    borderColor,
    icon: StatusIcon,
  } = TASK_STATUS_META[status];
  return (
    <div
      className={clsx(
        "flex h-fit max-h-[calc(100vh-48px)] w-fit flex-col justify-start",
        "rounded-sm border bg-gray-100",
        "dark:border-gray-400 dark:bg-gray-600",
        borderColor
      )}
    >
      <div
        className={clsx(
          "flex w-full items-center justify-between p-1.5",
          bgColor
        )}
      >
        <div className={clsx("flex w-fit items-center justify-start gap-2")}>
          <span className={clsx(textColor)}>
            <StatusIcon size={16} weight={"duotone"} />
          </span>
          <span className={clsx("text-xs font-medium", textColor)}>
            {label}
          </span>
        </div>
        <div className={clsx("flex w-fit items-center justify-start gap-2")}>
          <button title="Options">
            <EllipsisHorizontalIcon
              className={clsx("size-4 cursor-pointer text-gray-700")}
            />
          </button>
          <button title="Ajouter une tâche">
            <PlusIcon
              className={clsx("size-3 cursor-pointer stroke-2 text-gray-700")}
            />
          </button>
        </div>
      </div>
      {tasks.length > 0 ? (
        <>
          <div
            className={clsx(
              "flex h-fit max-h-[calc(100vh-48px)] w-fit min-w-50 flex-col gap-4 px-2 py-4",
              "overflow-x-hidden overflow-y-auto",
              "[&::-webkit-scrollbar]:w-1",
              "[&::-webkit-scrollbar-track]:bg-neutral-200",
              "[&::-webkit-scrollbar-thumb]:bg-neutral-300",
              "dark:[&::-webkit-scrollbar-track]:bg-neutral-700",
              "dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
            )}
          >
            {tasks.map(
              (task) =>
                task.status === status && <TaskCard key={task.id} task={task} />
            )}
          </div>
        </>
      ) : (
        <>
          <div
            className={clsx(
              "flex h-full min-w-50 flex-col items-center justify-center py-4"
            )}
          >
            <InboxIcon
              className={clsx("size-5 text-gray-400", "dark:text-gray-200")}
            />
            <span
              className={clsx(
                "text-xs font-medium text-gray-400",
                "dark:text-gray-200"
              )}
            >
              Aucune tâche
            </span>
          </div>
        </>
      )}
    </div>
  );
}
