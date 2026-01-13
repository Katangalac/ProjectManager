import { clsx } from "clsx";
import { TaskWithRelations } from "../../types/Task";
import TasksColumns from "./TasksColumn";
import { TASK_STATUSES } from "../../lib/constants/task";

/**
 * Propriétés du TasksKanban
 * - tasks: la liste des tâches à affichées dans le kanban
 */
export type TasksKanbanProps = {
  tasks: TaskWithRelations[];
};

/**
 * Affiche les taches dans un kanban par status
 * @param {TasksKanbanProps} param0 - la liste des taches
 */
export default function TasksKanban({ tasks }: TasksKanbanProps) {
  return (
    <div
      className={clsx(
        "flex h-full w-full justify-between gap-4 overflow-x-visible"
      )}
    >
      {TASK_STATUSES.map((status) => (
        <TasksColumns
          key={status}
          status={status}
          tasks={
            tasks.filter((task: TaskWithRelations) => task.status === status) ||
            []
          }
        />
      ))}
    </div>
  );
}
