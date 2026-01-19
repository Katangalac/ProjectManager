import { clsx } from "clsx";
import { TaskWithRelations } from "../../types/Task";
import { TASK_STATUS_META } from "../../lib/constants/task";
import { priorityLevelHelper } from "../../utils/priorityLevelHelper";
import UserProfilePhoto from "../profile/UserProfilePhoto";
import {
  CalendarPlusIcon,
  CalendarCheckIcon,
  CalendarXIcon,
  FlagIcon,
  FolderIcon,
  UsersIcon,
  NoteIcon,
  ChartPieSliceIcon,
  ChartBarIcon,
  UsersThreeIcon,
  CurrencyDollarIcon,
  CircleIcon,
} from "@phosphor-icons/react";
import { Progress } from "../ui/progress";

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
      <div className="flex w-full items-center justify-between">
        <div className={clsx("flex items-center justify-start gap-2")}>
          <span
            className={clsx(
              "flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"
            )}
          >
            <FlagIcon
              weight="duotone"
              size={20}
              className={clsx(
                priorityLevelHelper[task.priorityLevel].textStyle
              )}
            />{" "}
            Priority
          </span>
          <span
            className={clsx(
              "rounded-sm px-2 py-0.5 text-sm font-medium",
              priorityLevelHelper[task.priorityLevel].textStyle,
              priorityLevelHelper[task.priorityLevel].bgColor
            )}
          >
            {priorityLevelHelper[task.priorityLevel].label}
          </span>
        </div>
        <div className={clsx("flex items-center justify-start gap-2")}>
          <span
            className={clsx(
              "flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"
            )}
          >
            <ChartPieSliceIcon
              weight="fill"
              size={20}
              className={clsx(TASK_STATUS_META[task.status].textColor)}
            />{" "}
            status
          </span>
          <span
            className={clsx(
              "flex items-center gap-1 rounded-sm border border-gray-300 px-2 py-0.5 text-sm font-medium",
              TASK_STATUS_META[task.status].textColor
            )}
          >
            <CircleIcon
              weight="fill"
              size={10}
              className={clsx(TASK_STATUS_META[task.status].textColor)}
            />{" "}
            {TASK_STATUS_META[task.status].label}
          </span>
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <div className={clsx("flex items-center justify-start gap-2")}>
          <span
            className={clsx(
              "flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"
            )}
          >
            <CurrencyDollarIcon
              weight="fill"
              size={20}
              className={clsx("text-yellow-600")}
            />{" "}
            Cost
          </span>
          <span
            className={clsx(
              "text-sm font-medium text-black dark:text-gray-200"
            )}
          >
            {task.cost} CAD
          </span>
        </div>
      </div>

      <div className={clsx("flex items-center justify-start gap-2")}>
        <span
          className={clsx(
            "flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"
          )}
        >
          <FolderIcon
            weight="fill"
            size={20}
            className={clsx("text-yellow-500")}
          />{" "}
          Project
        </span>
        <span
          className={clsx("text-sm font-medium text-black dark:text-gray-200")}
        >
          {task.project ? (
            `"${task.project.title}"`
          ) : (
            <span className="font-normal text-gray-500 italic">"None"</span>
          )}
        </span>
      </div>
      <div className={clsx("flex items-center justify-start gap-2")}>
        <span
          className={clsx(
            "flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"
          )}
        >
          <UsersThreeIcon
            weight="fill"
            size={20}
            className={clsx("text-gray-500")}
          />{" "}
          Team
        </span>
        <span
          className={clsx("text-sm font-medium text-black dark:text-gray-200")}
        >
          {task.team ? (
            `"${task.team.name}"`
          ) : (
            <span className="font-normal text-gray-500 italic">"None"</span>
          )}
        </span>
      </div>
      <div className={clsx("flex items-center justify-start gap-2.5")}>
        <span
          className={clsx(
            "flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"
          )}
        >
          <UsersIcon
            weight="fill"
            size={20}
            className={clsx("text-gray-500")}
          />{" "}
          Assignees
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
            <span className="text-sm text-gray-500 italic">"Unassigned"</span>
          )}
        </span>
      </div>

      <div className="flex w-full items-center justify-between">
        <div className={clsx("flex items-center justify-start gap-2")}>
          <span
            className={clsx(
              "flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"
            )}
          >
            <CalendarPlusIcon
              weight="duotone"
              size={20}
              className={clsx("text-gray-500")}
            />{" "}
            Started on
          </span>
          <span
            className={clsx(
              "text-sm font-medium text-black dark:text-gray-200"
            )}
          >
            {new Date(task.startedAt).toISOString().split("T")[0]}
          </span>
        </div>

        <div className={clsx("flex items-center justify-start gap-2")}>
          <span
            className={clsx(
              "flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400",
              isOverDue && "font-medium text-red-600"
            )}
          >
            <CalendarXIcon
              weight="duotone"
              size={20}
              className={clsx(isOverDue && "text-red-600", "stroke-2")}
            />{" "}
            Deadline
          </span>
          <span
            className={clsx(
              "text-sm font-medium text-black dark:text-gray-200",
              isOverDue && "font-medium text-red-600"
            )}
          >
            {new Date(task.deadline).toISOString().split("T")[0]}
          </span>
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <div className={clsx("flex items-center justify-start gap-2")}>
          <span
            className={clsx(
              "flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400",
              task.status === "COMPLETED" && "text-green-500"
            )}
          >
            <CalendarCheckIcon
              weight="duotone"
              size={20}
              className={clsx(task.status === "COMPLETED" && "text-green-500")}
            />{" "}
            Completed on
          </span>
          <span
            className={clsx(
              "text-sm font-medium text-black dark:text-gray-200",
              task.status === "COMPLETED" && "font-medium text-green-500"
            )}
          >
            {task.completedAt ? (
              new Date(task.completedAt).toISOString().split("T")[0]
            ) : (
              <span className="font-normal text-gray-500 italic">
                "Not completed yet"
              </span>
            )}
          </span>
        </div>

        <div className={clsx("flex items-center justify-start gap-4")}>
          <span
            className={clsx(
              "flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"
            )}
          >
            <ChartBarIcon
              weight="duotone"
              size={20}
              className={clsx("text-sky-500")}
            />{" "}
            Progress
          </span>
          <div className="flex w-fit flex-col items-center gap-0.5">
            <span
              className={clsx(
                "text-xs font-medium text-black dark:text-gray-200"
              )}
            >
              {task.progress}%
            </span>
            <Progress
              value={task.progress}
              className={clsx("h-1.5 w-18 [&>div]:bg-sky-500")}
            />
          </div>
        </div>
      </div>

      <div className={clsx("flex flex-col items-start justify-start gap-1")}>
        <span
          className={clsx(
            "flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"
          )}
        >
          <NoteIcon
            weight="duotone"
            size={20}
            className={clsx("text-gray-600")}
          />{" "}
          Description
        </span>
        <p
          className={clsx(
            "h-30 w-full overflow-y-auto bg-gray-50 p-2 text-wrap",
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
