import TaskCard from "../components/task/TaskCard";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserTasks } from "../services/task.services";
import { clsx } from "clsx";
import { Task } from "../types/Task";

export default function UserTasksPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["currentUserTasks"],
    queryFn: getCurrentUserTasks,
  });
  console.log("Données : ", data);

  return (
    <div>
      {isLoading && <div>Chargement des tâches...</div>}
      {isError && (
        <div>
          <span className={clsx("text-red-700")}>
            Erreur lors de la récupérations tâches
          </span>
        </div>
      )}
      {data?.data?.map((task: Task) => (
        <div key={task.id}>
          <TaskCard task={task} />
        </div>
      ))}
      {!data && !isError && <div>Aucune tâche</div>}
    </div>
  );
}
