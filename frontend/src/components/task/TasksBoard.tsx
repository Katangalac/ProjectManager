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
    <div className={clsx("flex h-full w-full flex-col")}>
      <div className={clsx("flex-1")}>
        <div
          className={clsx(
            "grid h-fit gap-3 gap-x-3 gap-y-3 pb-4",
            "grid-cols-[repeat(auto-fit,minmax(13rem,1fr))]"
          )}
        >
          {(!tasks || tasks.length === 0) && <div>No tasks</div>}
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} className={clsx("shadow-lg")} />
          ))}
        </div>
      </div>
    </div>
  );
}
