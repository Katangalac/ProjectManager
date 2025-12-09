import { clsx } from "clsx";
import { TaskWithRelations } from "../../types/Task";
import {
  CalendarDateRangeIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { ProjectorScreenChartIcon } from "@phosphor-icons/react";
import TaskPriority from "./TaskPriority";
import UserProfilePhoto from "../profile/UserProfilePhoto";
import TaskActionMenu from "./TaskActionMenu";

/**
 * Propriétés du TaskCardProps
 * - task : la tâche à afficher dans la carte
 */
type TaskCardProps = {
  task: TaskWithRelations;
};

/**
 * Affiche une carte représentant une tâche avec son titre, son statut et son niveau de priorité
 *
 * @param {TaskCardProps} param0 - Propriétés du TaskCardProps
 * @returns - Le composant affichant la carte de la tâche
 */
export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div
      className={clsx(
        "flex h-fit w-fit min-w-50 flex-col gap-3 p-2.5",
        "rounded-md border border-gray-300 bg-white",
        "dark:border-gray-600 dark:bg-gray-800"
      )}
    >
      <div
        className={clsx(
          "flex w-full flex-col items-start justify-center gap-2"
        )}
      >
        <div
          className={clsx(
            "flex w-full flex-col items-start justify-center gap-2"
          )}
        >
          <div className="flex w-full items-center justify-between gap-3">
            <span
              className={clsx(
                "text-xs font-medium text-gray-700",
                "dark:text-white"
              )}
            >
              {task.title}
            </span>
            <TaskActionMenu task={task} />
          </div>
          <div
            className={clsx("w-full border-t border-dotted border-gray-400")}
          ></div>
        </div>

        <div className={clsx("flex w-full items-center justify-start gap-2")}>
          <ProjectorScreenChartIcon
            className={clsx("size-4 text-gray-500", "dark:text-white")}
          />
          <span
            className={clsx(
              "text-xs font-medium text-gray-500",
              "dark:text-white"
            )}
          >
            {task.project ? task.project.title : "-"}
          </span>
        </div>

        <div className={clsx("flex w-full items-center justify-start gap-2")}>
          <UserGroupIcon
            className={clsx("size-4 text-gray-500", "dark:text-white")}
          />
          <span
            className={clsx(
              "text-xs font-medium text-gray-500",
              "dark:text-white"
            )}
          >
            {task.team ? task.team.name : "-"}
          </span>
        </div>

        <div className={clsx("flex w-full items-center justify-start gap-2")}>
          <UserCircleIcon
            className={clsx("size-4 text-gray-500", "dark:text-white")}
          />
          <span
            className={clsx(
              "text-xs font-medium text-gray-500",
              "dark:text-white"
            )}
          >
            {task.assignedTo && task.assignedTo.length > 0 ? (
              <div className={clsx("flex gap-0.5")}>
                {task.assignedTo.map((a) => (
                  <UserProfilePhoto
                    key={a.user.id}
                    imageUrl={a.user.imageUrl}
                    username={a.user.userName}
                    email={a.user.email}
                  />
                ))}
              </div>
            ) : (
              "-"
            )}
          </span>
        </div>

        <div className={clsx("flex w-full items-center justify-start gap-2")}>
          <CalendarDateRangeIcon
            className={clsx("size-4 text-gray-500", "dark:text-white")}
          />
          <span
            className={clsx(
              "text-xs font-medium text-gray-500",
              "dark:text-white"
            )}
          >
            {new Date(task.deadline).toLocaleDateString()}
          </span>
        </div>

        <TaskPriority priorityLevel={task.priorityLevel} />
      </div>
    </div>
  );
}
