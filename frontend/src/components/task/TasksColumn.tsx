import { clsx } from "clsx";
import { TaskStatus } from "../../types/Task";
import { TaskWithRelations } from "../../types/Task";
import TaskCard from "./TaskCard";
import { TASK_STATUS_META } from "../../lib/constants/task";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { TASKFORM_DEFAULT_VALUES } from "../../lib/constants/task";
import {
  EllipsisHorizontalIcon,
  PlusIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import TaskForm from "./TaskForm";

/**
 * Propriétés du TasksColumns
 * - status: status associé à la colonne des tâches
 * - tasks: liste des tâches d'une colonne selon le status
 */
type TasksColumnProps = {
  status: TaskStatus;
  tasks: TaskWithRelations[];
};

/**
 * Affiche les tâches ayant un même status donné dans une colonne
 * @param {TasksColumnProps} param0 - Propriétés du TasksKanban
 */
export default function TasksColumns({ status, tasks }: TasksColumnProps) {
  const {
    label,
    textColor,
    bgColor,
    borderColor,
    icon: StatusIcon,
  } = TASK_STATUS_META[status];

  const [showDialog, setShowDialog] = useState(false);
  const taskFormDefaultValues = { ...TASKFORM_DEFAULT_VALUES, status };

  return (
    <>
      <div
        className={clsx(
          "flex h-fit max-h-[calc(100vh-110px)] min-h-[calc(100vh-110px)] w-fit flex-col justify-start",
          "rounded-lg border bg-gray-50",
          "dark:border-gray-400 dark:bg-gray-600",
          borderColor
        )}
      >
        <div
          className={clsx(
            "flex w-full items-center justify-between rounded-t-lg p-1.5",
            bgColor
          )}
        >
          <div className={clsx("flex w-fit items-center justify-start gap-2")}>
            <span className={clsx(textColor)}>
              <StatusIcon size={16} weight={"duotone"} />
            </span>
            <span
              className={clsx("text-center text-xs font-medium", textColor)}
            >
              {label} [{tasks.length}]
            </span>
          </div>
          <div className={clsx("flex w-fit items-center justify-start gap-2")}>
            <button title="Options">
              <EllipsisHorizontalIcon
                className={clsx("size-4 cursor-pointer text-gray-700")}
              />
            </button>
            <button title="New task" onClick={() => setShowDialog(true)}>
              <PlusIcon
                className={clsx("size-3 cursor-pointer stroke-2 text-gray-700")}
              />
            </button>
          </div>
        </div>
        {tasks.length > 0 ? (
          <div
            className={clsx(
              "flex h-fit w-fit min-w-50 flex-col gap-4 px-2 py-4",
              "overflow-x-hidden overflow-y-auto",
              "[&::-webkit-scrollbar]:w-0",
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
        ) : (
          <div
            className={clsx(
              "flex h-full min-h-[calc(100vh-200px)] min-w-50 flex-col items-center justify-center py-4"
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
        )}
      </div>
      <Dialog
        header="New task"
        visible={showDialog}
        style={{ width: "40vw" }}
        modal
        onHide={() => setShowDialog(false)}
        className={clsx(
          "min-w-fit gap-5 rounded-lg border border-gray-300 bg-white p-5 text-sm",
          "dark:border-gray-600 dark:bg-gray-900",
          "text-gray-700 dark:text-gray-300",
          "myDialog"
        )}
      >
        <TaskForm
          isUpdateForm={false}
          disableStatusInput={true}
          defaultValues={taskFormDefaultValues}
          onSuccess={() => setShowDialog(false)}
        />
      </Dialog>
    </>
  );
}
