import { TaskWithRelations } from "../../types/Task";
import TaskCard from "./TaskCard";
import { clsx } from "clsx";

/**
 * Propriétés du TasksBoard
 * - tasks : la liste des tâches à afficher dans le board
 */
type TasksBoardProps = {
  tasks: TaskWithRelations[];
};

/**
 *Affiche les tâches sous la forme d'un board
 * @param {TasksBoardProps} param0 - Propriétés du TasksBoard
 */
export default function TasksBoard({ tasks }: TasksBoardProps) {
  return (
    <div
      className={clsx(
        "grid min-h-screen grid-cols-1 gap-x-2 gap-y-5 lg:grid-cols-4"
      )}
    >
      {(!tasks || tasks.length === 0) && <div>No tasks</div>}
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} className={clsx("shadow-lg")} />
      ))}
    </div>
  );
}
