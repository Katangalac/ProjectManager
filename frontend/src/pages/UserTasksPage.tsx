import TaskCardContainer from "../components/task/TaskCardContainer";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserTasks } from "../services/task.services";
import { clsx } from "clsx";
import { TaskWithRelations } from "../types/Task";
import { TASK_STATUSES } from "../lib/constants/task";

export default function UserTasksPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["currentUserTasks"],
    queryFn: getCurrentUserTasks,
  });
  console.log("Données : ", data);

  return (
    <div className={clsx("grid grid-cols-1 gap-x-2 gap-y-5 lg:grid-cols-4")}>
      {isLoading && <div>Chargement des tâches...</div>}
      {isError && (
        <div>
          <span className={clsx("text-red-700")}>
            Erreur lors de la récupérations tâches
          </span>
        </div>
      )}

      {TASK_STATUSES.map((status) => (
        <TaskCardContainer
          key={status}
          status={status}
          tasks={
            data?.data.filter(
              (task: TaskWithRelations) => task.status === status
            ) || []
          }
        />
      ))}
      {!data && !isError && <div>Aucune tâche</div>}
    </div>
  );
}
