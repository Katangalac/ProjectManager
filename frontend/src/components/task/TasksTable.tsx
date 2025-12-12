import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TaskWithRelations } from "../../types/Task";
import { clsx } from "clsx";
import { TASK_STATUS_META } from "../../lib/constants/task";
import { priorityLevelHelper } from "../../utils/priorityLevelHelper";
import { CircleIcon } from "@phosphor-icons/react";
import UserProfilePhoto from "../profile/UserProfilePhoto";
import TaskActionMenu from "./TaskActionMenu";

/**
 * Propriétés du TasksTable
 * - tasks: la liste des tâches à afficher dans la table
 */
type TasksTableProps = {
  tasks: TaskWithRelations[];
};

/**
 * Affiche les tâches dans une table
 * @param {TasksTableProps} param0 - Propriétés du TasksTable
 */
export default function TasksTable({ tasks }: TasksTableProps) {
  return (
    <div className={clsx("min-h-screen")}>
      <DataTable
        value={tasks}
        emptyMessage="No tasks."
        scrollable
        className={clsx(
          "min-w-full rounded-sm border border-gray-200 text-black",
          "dark:text-gray-200",
          "dark:border-gray-500"
        )}
        rowClassName={() => "border-b last:border-b-0 border-gray-200"}
        tableStyle={{ minWidth: "1000px" }}
        header={
          <div
            className={clsx(
              "border-b border-gray-200 p-2",
              "text-left text-sm font-semibold",
              "dark:border-gray-500"
            )}
          >
            Tasks list
          </div>
        }
      >
        <Column
          field="title"
          header="Title"
          className={clsx(
            "flex items-center justify-start p-2 text-xs font-medium"
          )}
          headerClassName={clsx(
            "border-b border-gray-200 p-2 text-left text-xs font-medium text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>
        <Column
          field="project.title"
          header="Project"
          body={(task) => task.project?.title ?? "—"}
          className={clsx("w-fit p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200 text-left p-2 text-xs font-medium text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>

        <Column
          field="team.name"
          header="Team"
          body={(task) => task.team?.name ?? "—"}
          className={clsx("w-fit p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200 text-left p-2 text-xs font-medium text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>
        <Column
          field="assignedTo"
          header="Assigned to"
          body={(task: TaskWithRelations) =>
            task.assignedTo && task.assignedTo.length > 0 ? (
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
            )
          }
          className={clsx("w-fit p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200 text-left p-2 text-xs font-medium text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
        ></Column>
        <Column
          header="Priority"
          field="priorityLevel"
          body={(task: TaskWithRelations) => (
            <div
              className={clsx(
                "flex w-fit items-center gap-1 rounded-sm border border-gray-200 p-0.5",
                "dark:border-gray-500"
              )}
            >
              <CircleIcon
                size={8}
                weight="fill"
                className={clsx(
                  priorityLevelHelper[task.priorityLevel].textStyle
                )}
              />
              <span>{priorityLevelHelper[task.priorityLevel].label}</span>
            </div>
          )}
          className={clsx("w-fit p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200 text-left text-xs p-2 font-medium text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>
        <Column
          header="Status"
          body={(task: TaskWithRelations) => (
            <div
              className={clsx(
                "flex w-fit items-center gap-1 rounded-sm border border-gray-200 p-0.5",
                "dark:border-gray-500"
              )}
            >
              <CircleIcon
                size={8}
                weight="fill"
                className={clsx(TASK_STATUS_META[task.status].textColor)}
              />
              <span>{TASK_STATUS_META[task.status].label}</span>
            </div>
          )}
          className={clsx("w-fit p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200 text-left text-xs p-2 font-medium text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
        ></Column>
        <Column
          field="deadline"
          header="Deadline"
          body={(rowData) => new Date(rowData.deadline).toLocaleDateString()}
          className={clsx("w-fit p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200  text-left text-xs p-2 font-medium text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>
        <Column
          header=""
          body={(task) => <TaskActionMenu task={task} />}
          className={clsx("w-fit p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200  text-left text-xs p-2 font-medium text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
        ></Column>
      </DataTable>
    </div>
  );
}
