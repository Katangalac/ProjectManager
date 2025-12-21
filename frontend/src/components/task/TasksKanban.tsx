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

export default function TasksKanban({ tasks }: TasksKanbanProps) {
  return (
    <div className={clsx("flex w-full justify-between")}>
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
