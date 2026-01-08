import { clsx } from "clsx";
import { TaskWithRelations } from "../../types/Task";
import {
  CalendarDateRangeIcon,
  UserCircleIcon,
  UserGroupIcon,
  CheckCircleIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import TaskPriority from "./TaskPriority";
import UserProfilePhoto from "../profile/UserProfilePhoto";
import { useState } from "react";
import TaskCardHeader from "./TaskCardHeader";

/**
 * Propriétés du TaskCardProps
 * - task : la tâche à afficher dans la carte
 */
type TaskCardProps = {
  task: TaskWithRelations;
  className?: string;
};

/**
 * Affiche une carte représentant une tâche avec son titre, son statut et son niveau de priorité
 *
 * @param {TaskCardProps} param0 - Propriétés du TaskCardProps
 * @returns - Le composant affichant la carte de la tâche
 */
export default function TaskCard({ task, className }: TaskCardProps) {
  const [flipped, setFlipped] = useState(false);
  const isOverDue =
    task.status !== "COMPLETED" && new Date(task.deadline) < new Date();
  return (
    <div
      className={clsx(
        "h-44 w-full max-w-60 bg-transparent perspective-[1000px]"
      )}
    >
      <div
        className={clsx(
          "relative h-44 w-full transition-transform duration-800 transform-3d",
          flipped ? "rotate-y-180" : ""
        )}
      >
        {/**FRONT-SIDE */}
        <div className={clsx("absolute h-44 w-full backface-hidden")}>
          <div
            className={clsx(
              "flex h-44 w-full flex-col gap-3 p-2.5",
              "rounded-md border border-gray-300 bg-white",
              "dark:border-gray-600 dark:bg-gray-800",
              className
            )}
          >
            <div
              className={clsx(
                "flex w-full flex-col items-start justify-center gap-2"
              )}
            >
              <TaskCardHeader
                task={task}
                flipped={flipped}
                onArrowButtonClick={() => setFlipped(!flipped)}
              />

              <div
                className={clsx("flex w-full items-center justify-start gap-2")}
              >
                <FolderIcon
                  className={clsx("size-4 text-gray-500", "dark:text-white")}
                />
                <span
                  className={clsx(
                    "truncate text-xs font-medium text-gray-500",
                    "dark:text-white"
                  )}
                  title={task.project?.title}
                >
                  {task.project ? task.project.title : "-"}
                </span>
              </div>

              <div
                className={clsx("flex w-full items-center justify-start gap-2")}
              >
                <UserGroupIcon
                  className={clsx("size-4 text-gray-500", "dark:text-white")}
                />
                <span
                  className={clsx(
                    "truncate text-xs font-medium text-gray-500",
                    "dark:text-white"
                  )}
                  title={task.team?.name}
                >
                  {task.team ? task.team.name : "-"}
                </span>
              </div>

              <div
                className={clsx("flex w-full items-center justify-start gap-2")}
              >
                <UserCircleIcon
                  className={clsx("size-4 text-gray-500", "dark:text-white")}
                />
                <span
                  className={clsx(
                    "overflow-x-auto text-xs font-medium text-gray-500",
                    "[&::-webkit-scrollbar]:w-0",
                    "dark:text-white"
                  )}
                >
                  {task.assignedTo && task.assignedTo.length > 0 ? (
                    <div className={clsx("flex -space-x-2")}>
                      {task.assignedTo.map((a) => (
                        <UserProfilePhoto
                          key={a.user.id}
                          userId={a.user.id}
                          imageUrl={a.user.imageUrl}
                          username={a.user.userName}
                          email={a.user.email}
                          className="ring-1 ring-white"
                          imagefallback={
                            a.user.firstName && a.user.lastName
                              ? `${a.user.firstName[0].toUpperCase() + a.user.lastName[0].toUpperCase()}`
                              : undefined
                          }
                          imageClassName="text-[10px]"
                        />
                      ))}
                    </div>
                  ) : (
                    "-"
                  )}
                </span>
              </div>

              <div
                className={clsx("flex w-full items-center justify-start gap-2")}
              >
                <CalendarDateRangeIcon
                  className={clsx(
                    "size-4",
                    "dark:text-white",
                    isOverDue ? "text-red-500" : "text-gray-500"
                  )}
                />
                <span
                  className={clsx(
                    "text-xs font-medium text-gray-500",
                    "dark:text-white"
                  )}
                >
                  {new Date(task.deadline).toISOString().split("T")[0]}
                </span>
                {isOverDue && (
                  <span className={clsx("text-xs font-medium text-red-600")}>
                    Overdue!
                  </span>
                )}
                {task.status === "COMPLETED" && (
                  <CheckCircleIcon
                    className={clsx("size-4 stroke-2 text-green-500")}
                  />
                )}
              </div>
              <TaskPriority priorityLevel={task.priorityLevel} />
            </div>
          </div>
        </div>

        {/**BACK-SIDE*/}
        <div
          className={clsx("absolute h-44 w-full rotate-y-180 backface-hidden")}
        >
          <div
            className={clsx(
              "flex h-44 w-full flex-col gap-3 p-2.5",
              "rounded-md border border-gray-300 bg-white",
              "dark:border-gray-600 dark:bg-gray-800",
              className
            )}
          >
            <div
              className={clsx(
                "flex w-full flex-col items-start justify-center gap-2"
              )}
            >
              <TaskCardHeader
                task={task}
                flipped={flipped}
                onArrowButtonClick={() => setFlipped(!flipped)}
              />
              <p
                className={clsx(
                  "overflow-y-auto text-left text-xs text-wrap text-gray-500",
                  "[&::-webkit-scrollbar]:w-0"
                )}
              >
                {task.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
