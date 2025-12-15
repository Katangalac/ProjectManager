import { clsx } from "clsx";
import { TeamWithRelations } from "../../types/Team";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import UserProfilePhoto from "../profile/UserProfilePhoto";

type TeamMembersTableProps = {
  team: TeamWithRelations;
  showLeaderOnly: boolean;
};

export default function TeamMembersTable({
  team,
  showLeaderOnly,
}: TeamMembersTableProps) {
  return (
    <div className={clsx("flex flex-col items-start")}>
      {team.teamUsers && (
        <DataTable
          value={
            showLeaderOnly
              ? team.teamUsers.filter(
                  (teamUser) => teamUser.user.id === team.leaderId
                )
              : team.teamUsers
          }
          emptyMessage="No members."
          scrollable
          className={clsx(
            "w-full rounded-sm border border-gray-200 text-black",
            "dark:text-gray-200",
            "dark:border-gray-500"
          )}
          rowClassName={() => "border-b last:border-b-0 border-gray-200"}
          tableStyle={{ minWidth: "800px" }}
        >
          <Column
            header="UserName"
            className={clsx(
              "flex items-center justify-start p-2 text-xs font-medium"
            )}
            headerClassName={clsx(
              "border-b border-gray-200 p-2 bg-sky-50 text-left text-xs font-medium text-gray-500",
              "dark:text-gray-400",
              "dark:border-gray-500"
            )}
            body={(teamUser) => (
              <div
                className={clsx(
                  "flex w-fit items-center gap-1 rounded-sm border border-gray-200 p-0.5",
                  "dark:border-gray-500"
                )}
              >
                <UserProfilePhoto
                  imageUrl={teamUser.user.imageUrl}
                  email={teamUser.user.email}
                  username={teamUser.user.userName}
                />
                <span>{teamUser.user.userName}</span>
              </div>
            )}
            sortable
          ></Column>
          <Column
            header="Firstname"
            body={(teamUser) => teamUser.user.firstName ?? "—"}
            className={clsx("w-fit p-2 text-left text-xs")}
            headerClassName={clsx(
              "border-b border-gray-200 bg-sky-50 text-left p-2 text-xs font-medium text-gray-500",
              "dark:text-gray-400",
              "dark:border-gray-500"
            )}
            sortable
          ></Column>

          <Column
            header="Lastname"
            body={(teamUser) => teamUser.user.lastName ?? "—"}
            className={clsx("w-fit p-2 text-left text-xs")}
            headerClassName={clsx(
              "border-b border-gray-200 bg-sky-50 text-left p-2 text-xs font-medium text-gray-500",
              "dark:text-gray-400",
              "dark:border-gray-500"
            )}
            sortable
          ></Column>
          <Column
            header="Profession"
            body={(teamUser) => teamUser.user.profession ?? "—"}
            className={clsx("w-fit p-2 text-left text-xs")}
            headerClassName={clsx(
              "border-b border-gray-200 bg-sky-50 text-left p-2 text-xs font-medium text-gray-500",
              "dark:text-gray-400",
              "dark:border-gray-500"
            )}
            sortable
          ></Column>
          <Column
            header="Rôle"
            body={(teamUser) =>
              teamUser.userRole && teamUser.userRole.trim() !== ""
                ? teamUser.userRole
                : "—"
            }
            className={clsx("w-fit p-2 text-left text-xs")}
            headerClassName={clsx(
              "border-b border-gray-200 bg-sky-50 text-left p-2 text-xs font-medium text-gray-500",
              "dark:text-gray-400",
              "dark:border-gray-500"
            )}
            sortable
          ></Column>
        </DataTable>
      )}
    </div>
  );
}
