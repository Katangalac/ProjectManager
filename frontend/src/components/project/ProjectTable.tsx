import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Project } from "@/types/Project";
import { clsx } from "clsx";
import { PROJECT_STATUS_META } from "@/lib/constants/project";
import { CircleIcon } from "@phosphor-icons/react";
import { formatShortDateWithOptionalYear } from "@/utils/dateUtils";
import ProjectActionMenu from "./ProjectActionMenu";
import { Progress } from "../ui/progress";

/**
 * Propriétés du ProjectsTable
 * - projects: la liste des projets à afficher dans la table
 */
type ProjectsTableProps = {
  projects: Project[];
};

/**
 * Affiche les projets dans une table
 * @param {ProjectsTableProps} param0 - Propriétés du ProjectsTable
 */
export default function ProjectsTable({ projects }: ProjectsTableProps) {
  return (
    <div className={clsx("flex max-h-[600px] w-full")}>
      <DataTable
        value={projects}
        emptyMessage="No projects."
        scrollable
        scrollHeight="500px"
        className={clsx(
          "min-w-full rounded-sm border border-gray-200 text-black",
          "dark:text-gray-200",
          "dark:border-gray-500",
          "[&::-webkit-scrollbar]:w-1"
        )}
        rowClassName={() =>
          clsx(
            "border-b last:border-b-0 border-gray-200",
            "[&>table]:rounded-b-md",
            "[&>table]:border",
            "[&>table]:border-red-500",
            "[&>tr]:rounded-bl-md",
            "[&>tr]:rounded-br-md"
          )
        }
        tableStyle={{ minWidth: "500px", maxHeight: "500px" }}
        header={
          <div
            className={clsx(
              "rounded-t-sm bg-sky-500 p-2",
              "text-left text-sm font-semibold text-white",
              "dark:border-gray-500"
            )}
          >
            Projects list
          </div>
        }
      >
        <Column
          field="title"
          header="Title"
          className={clsx(
            "flex items-center justify-start truncate p-2 text-xs font-medium"
          )}
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50 p-2 text-left text-xs font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>

        <Column
          header="Status"
          body={(project: Project) => (
            <div
              className={clsx(
                "flex w-fit items-center gap-1 rounded-sm border border-gray-200 p-0.5",
                "dark:border-gray-500"
              )}
            >
              <CircleIcon
                size={8}
                weight="fill"
                className={clsx(PROJECT_STATUS_META[project.status].textColor)}
              />
              <span>{PROJECT_STATUS_META[project.status].label}</span>
            </div>
          )}
          className={clsx("w-fit p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50 text-left text-xs p-2 font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
        ></Column>

        <Column
          field="progress"
          header="Progress(%)"
          body={(rowData) => (
            <Progress
              value={rowData.progress}
              className={clsx("h-1.5 max-w-20 [&>div]:bg-sky-500")}
            />
          )}
          className={clsx(
            "flex items-center justify-start truncate p-2 text-xs font-medium"
          )}
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50 p-2 text-left text-xs font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>

        <Column
          field="startedAt"
          header="Started on"
          body={(rowData) =>
            formatShortDateWithOptionalYear(new Date(rowData.startedAt))
          }
          className={clsx("w-fit p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50  text-left text-xs p-2 font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>
        <Column
          field="deadline"
          header="Deadline"
          body={(rowData) =>
            formatShortDateWithOptionalYear(new Date(rowData.deadline))
          }
          className={clsx("w-fit p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50  text-left text-xs p-2 font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>
        <Column
          field="completedAt"
          header="Completed at"
          body={(rowData) =>
            rowData.completedAt ? (
              formatShortDateWithOptionalYear(new Date(rowData.completedAt))
            ) : (
              <span className="text-gray-500 italic">Not completed yet</span>
            )
          }
          className={clsx("w-fit p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50  text-left text-xs p-2 font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>
        <Column
          header="Actions"
          body={(project) => <ProjectActionMenu project={project} />}
          className={clsx("flex justify-center p-2 text-xs")}
          headerClassName={clsx(
            "flex justify-center border-b border-gray-200 text-center  text-xs p-2 font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
        ></Column>
      </DataTable>
    </div>
  );
}
