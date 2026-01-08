import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InvitationWithRelations } from "@/types/Invitation";
import { clsx } from "clsx";
import { dateToLongString } from "@/utils/dateUtils";
import UserBasicInfo from "../profile/UserBasicInfo";

/**
 * Propriétés du TeamsTable
 * - teams: la liste des équipes à afficher dans la table
 */
type TeamInvitationsTableProps = {
  invitations: InvitationWithRelations[];
};

/**
 * Affiche les équipes dans une table
 * @param {TeamInvitationsTableProps} param0 - Propriétés du TeamsTable
 */
export default function TeamInvitationsTable({
  invitations,
}: TeamInvitationsTableProps) {
  return (
    <div className={clsx("flex max-h-[600px] w-full")}>
      <DataTable
        value={invitations}
        emptyMessage="No invitations."
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
        tableStyle={{ minWidth: "1000px" }}
        header={
          <div
            className={clsx(
              "rounded-t-sm bg-sky-500 p-2",
              "text-left text-sm font-semibold text-white",
              "dark:border-gray-500"
            )}
          >
            Invitations list
          </div>
        }
      >
        <Column
          header="Sender"
          className={clsx(
            "flex items-center justify-start truncate p-2 text-xs font-medium"
          )}
          body={(rowData: InvitationWithRelations) =>
            rowData.sender ? <UserBasicInfo user={rowData.sender} /> : '"None"'
          }
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50 p-2 text-left text-xs font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>

        <Column
          header="Receiver"
          className={clsx(
            "flex items-center justify-start truncate p-2 text-xs font-medium"
          )}
          body={(rowData: InvitationWithRelations) =>
            rowData.receiver ? (
              <UserBasicInfo user={rowData.receiver} />
            ) : (
              '"None"'
            )
          }
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50 p-2 text-left text-xs font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>

        <Column
          header="Status"
          className={clsx(
            "flex items-center justify-start truncate p-2 text-xs font-medium"
          )}
          body={(rowData: InvitationWithRelations) =>
            rowData.status === "ACCEPTED"
              ? "Accepted"
              : rowData.status === "REJECTED"
                ? "Rejected"
                : "Pending"
          }
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50 p-2 text-left text-xs font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>

        <Column
          header="Created at"
          body={(rowData: InvitationWithRelations) =>
            dateToLongString(new Date(rowData.createdAt))
          }
          className={clsx("w-fit p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50  text-left text-xs p-2 font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>
      </DataTable>
    </div>
  );
}
