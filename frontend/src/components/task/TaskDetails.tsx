import { clsx } from "clsx";
import { TaskWithRelations } from "../../types/Task";
import { TASK_STATUS_META } from "../../lib/constants/task";
import { priorityLevelHelper } from "../../utils/priorityLevelHelper";
import UserProfilePhoto from "../profile/UserProfilePhoto";
import { dateToLongString } from "@/utils/dateUtils";

/**
 * Propriétés du component TaskDetails
 *
 * - task : la tâche dont on veut afficher les informations détaillées
 */
export type TaskDetailsProps = {
  task: TaskWithRelations;
};

/**
 * Affiche les informations détaillées d'une tâche
 *
 * @param {TaskDetailsProps} param0 - propriétés du TaskDetails
 */
export default function TaskDetails({ task }: TaskDetailsProps) {
  const isOverDue =
    task.status !== "COMPLETED" && new Date(task.deadline) < new Date();
  return (
    <div className={clsx("flex flex-col gap-4 pr-4")}>
      <div className={clsx("flex items-center justify-start gap-2")}>
        <span
          className={clsx(
            "w-25 text-sm font-medium text-gray-500 dark:text-gray-400"
          )}
        >
          Project :
        </span>
        <span
          className={clsx("text-sm font-normal text-black dark:text-gray-200")}
        >
          {task.project ? task.project.title : "-"}
        </span>
      </div>
      <div className={clsx("flex items-center justify-start gap-2")}>
        <span
          className={clsx(
            "w-25 text-sm font-medium text-gray-500 dark:text-gray-400"
          )}
        >
          Team :
        </span>
        <span
          className={clsx("text-sm font-normal text-black dark:text-gray-200")}
        >
          {task.team ? task.team.name : "-"}
        </span>
      </div>
      <div className={clsx("flex items-center justify-start gap-2")}>
        <span
          className={clsx(
            "w-25 text-sm font-medium text-gray-500 dark:text-gray-400"
          )}
        >
          Assigned to :
        </span>
        <span className={clsx("overflow-x-auto", "[&::-webkit-scrollbar]:w-0")}>
          {task.assignedTo && task.assignedTo.length > 0 ? (
            <div className={clsx("flex -space-x-2")}>
              {task.assignedTo.map((a) => (
                <UserProfilePhoto
                  key={a.user.id}
                  userId={a.user.id}
                  imageUrl={a.user.imageUrl}
                  username={a.user.userName}
                  email={a.user.email}
                  size="h-9 w-9"
                  className="ring-2 ring-white"
                  imagefallback={
                    a.user.firstName && a.user.lastName
                      ? `${a.user.firstName[0].toUpperCase() + a.user.lastName[0].toUpperCase()}`
                      : undefined
                  }
                  imageClassName="text-lg"
                />
              ))}
            </div>
          ) : (
            "-"
          )}
        </span>
      </div>
      <div className={clsx("flex items-center justify-start gap-2")}>
        <span
          className={clsx(
            "w-25 text-sm font-medium text-gray-500 dark:text-gray-400"
          )}
        >
          status :
        </span>
        <span
          className={clsx(
            "text-sm font-normal",
            TASK_STATUS_META[task.status].textColor
          )}
        >
          {TASK_STATUS_META[task.status].label}
        </span>
      </div>
      <div className={clsx("flex items-center justify-start gap-2")}>
        <span
          className={clsx(
            "w-25 text-sm font-medium text-gray-500 dark:text-gray-400"
          )}
        >
          Priority :
        </span>
        <span
          className={clsx(
            "text-sm font-normal",
            priorityLevelHelper[task.priorityLevel].textStyle
          )}
        >
          {priorityLevelHelper[task.priorityLevel].label}
        </span>
      </div>
      <div className={clsx("flex items-center justify-start gap-2")}>
        <span
          className={clsx(
            "w-25 text-sm font-medium text-gray-500 dark:text-gray-400"
          )}
        >
          Progress :
        </span>
        <span
          className={clsx("text-sm font-normal text-black dark:text-gray-200")}
        >
          {task.progress}%
        </span>
      </div>
      <div className={clsx("flex items-center justify-start gap-2")}>
        <span
          className={clsx(
            "w-25 text-sm font-medium text-gray-500 dark:text-gray-400"
          )}
        >
          Cost :
        </span>
        <span
          className={clsx("text-sm font-normal text-black dark:text-gray-200")}
        >
          {task.cost}
        </span>
      </div>
      <div className={clsx("flex items-center justify-start gap-2")}>
        <span
          className={clsx(
            "w-25 text-sm font-medium text-gray-500 dark:text-gray-400"
          )}
        >
          Started on :
        </span>
        <span
          className={clsx("text-sm font-normal text-black dark:text-gray-200")}
        >
          {dateToLongString(new Date(task.startedAt))}
        </span>
      </div>
      <div className={clsx("flex items-center justify-start gap-2")}>
        <span
          className={clsx(
            "w-25 text-sm font-medium text-gray-500 dark:text-gray-400"
          )}
        >
          Deadline :
        </span>
        <span
          className={clsx("text-sm font-normal text-black dark:text-gray-200")}
        >
          {dateToLongString(new Date(task.deadline))}
        </span>
        {isOverDue && (
          <span className={clsx("text-sm font-medium text-red-600")}>
            Overdue!
          </span>
        )}
      </div>
      <div className={clsx("flex items-center justify-start gap-2")}>
        <span
          className={clsx(
            "w-25 text-sm font-medium text-gray-500 dark:text-gray-400"
          )}
        >
          Completed At :
        </span>
        <span
          className={clsx("text-sm font-normal text-black dark:text-gray-200")}
        >
          {task.completedAt
            ? dateToLongString(new Date(task.completedAt))
            : "Not completed yet"}
        </span>
      </div>
      <div className={clsx("flex flex-col items-start justify-start gap-1")}>
        <span
          className={clsx(
            "text-sm font-medium text-gray-500 dark:text-gray-400"
          )}
        >
          Description :
        </span>
        <p
          className={clsx(
            "h-30 w-full overflow-y-auto p-2 text-wrap",
            "rounded-sm border border-gray-200",
            "text-sm font-normal text-black dark:text-gray-200"
          )}
        >
          {task.description ? task.description : "-"}
        </p>
      </div>
    </div>
  );
}
