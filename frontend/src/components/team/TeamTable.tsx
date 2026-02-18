import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TeamWithRelations } from "@/types/Team";
import { clsx } from "clsx";
// import TeamActionMenu from "./TeamActionMenu";
import UserBasicInfo from "../profile/UserBasicInfo";

/**
 * Propriétés du TeamsTable
 * - teams: la liste des équipes à afficher dans la table
 */
type TeamsTableProps = {
  teams: TeamWithRelations[];
};

/**
 * Affiche les équipes dans une table
 * @param {TeamsTableProps} param0 - Propriétés du TeamsTable
 */
export default function TeamsTable({ teams }: TeamsTableProps) {
  return (
    <div className={clsx("flex max-h-[600px] w-full")}>
      <DataTable
        value={teams}
        emptyMessage="No teams"
        scrollable
        scrollHeight="500px"
        className={clsx(
          "w-full rounded-sm border border-gray-200 text-black shadow-md",
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
        tableStyle={{
          minWidth: "500px",
          maxHeight: "500px",
        }}
        header={
          <div
            className={clsx(
              "rounded-t-sm bg-sky-500 p-2",
              "text-left text-sm font-semibold text-white",
              "dark:border-gray-500"
            )}
          >
            Teams list
          </div>
        }
      >
        <Column
          field="name"
          header="Name"
          className={clsx("flex items-center justify-start truncate p-2 text-xs font-medium")}
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50 p-2 text-left text-xs font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>

        <Column
          field="user"
          header="Creator"
          body={(team: TeamWithRelations) =>
            team.user ? (
              <UserBasicInfo user={team.user} />
            ) : (
              <span className="text-gray-500 italic">"None"</span>
            )
          }
          className={clsx("w-fit p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50 text-left p-2 text-xs font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
        ></Column>

        <Column
          field="teamUsers"
          header="#Members"
          body={(team: TeamWithRelations) =>
            team.teamUsers ? (
              team.teamUsers.length.toString()
            ) : (
              <span className="text-gray-500 italic">"None"</span>
            )
          }
          className={clsx("w-fit p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50 text-left p-2 text-xs font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
        ></Column>

        <Column
          field="createdAt"
          header="Created at"
          body={(rowData) => new Date(rowData.createdAt).toISOString().split("T")[0]}
          className={clsx("w-fit p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50  text-left text-xs p-2 font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>
        <Column
          field="updatedAt"
          header="Last update"
          body={(rowData) => new Date(rowData.updatedAt).toISOString().split("T")[0]}
          className={clsx("w-fit p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50  text-left text-xs p-2 font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>
        {/* <Column
          header="Actions"
          body={(team) => <TeamActionMenu team={team} />}
          className={clsx("flex justify-center p-2 text-left text-xs")}
          headerClassName={clsx(
            "flex justify-center border-b border-gray-200 bg-sky-50  text-left text-xs p-2 font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
        ></Column> */}
      </DataTable>
    </div>
  );
}
