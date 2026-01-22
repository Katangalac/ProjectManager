import { clsx } from "clsx";
import { TeamWithRelations } from "../../types/Team";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import UserProfilePhoto from "../profile/UserProfilePhoto";
import TeamMemberTableActionMenu from "./TeamMemberTableActionMenu";

/**
 * Propriétés du TeamMembersTable
 *
 *  - team : l'équipe dont on veut afficher les membres
 *  - showLeaderOnly: détermine si on affiche que les membres qui sont leaders de l'équipe
 */
type TeamMembersTableProps = {
  team: TeamWithRelations;
  showLeaderOnly: boolean;
};

/**
 * Affiche les membres d'une équipe dans une table
 *
 * @param {TeamMembersTableProps} param0 - proprités du TeamMembersTable
 */
export default function TeamMembersTable({
  team,
  showLeaderOnly,
}: TeamMembersTableProps) {
  return (
    <div className={clsx("flex max-h-[600px] w-full")}>
      {team.teamUsers && (
        <DataTable
          value={
            showLeaderOnly
              ? team.teamUsers.filter(
                  (teamUser) =>
                    teamUser.user.id === team.leaderId ||
                    teamUser.userRole === "Leader"
                )
              : team.teamUsers
          }
          emptyMessage="No members."
          scrollable
          scrollHeight="500px"
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
                  "flex w-fit items-center gap-1 rounded-sm p-0.5",
                  "dark:border-gray-500"
                )}
              >
                <UserProfilePhoto
                  userId={teamUser.user.id}
                  imageUrl={teamUser.user.imageUrl}
                  email={teamUser.user.email}
                  username={teamUser.user.userName}
                  showOnlineStatus={true}
                  imagefallback={
                    teamUser.user.firstName && teamUser.user.lastName
                      ? `${teamUser.user.firstName[0].toUpperCase() + teamUser.user.lastName[0].toUpperCase()}`
                      : undefined
                  }
                  imageClassName="text-sm"
                  size="size-12"
                />
                <span>{teamUser.user.userName}</span>
              </div>
            )}
            sortable
          ></Column>
          <Column
            header="Firstname"
            body={(teamUser) =>
                teamUser.user.firstName && teamUser.user.firstName || (
                <span className="text-gray-500 italic">"None"</span>
              )
            }
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
            body={(teamUser) =>
                teamUser.user.lastName && teamUser.user.lastName?.trim() !== "" ? (
                teamUser.user.lastName
              ) : (
                <span className="text-gray-500 italic">"None"</span>
              )
            }
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
            body={(teamUser) =>
                teamUser.user.profession && teamUser.user.profession?.trim() !== "" ? (
                teamUser.user.profession
              ) : (
                <span className="text-gray-500 italic">"None"</span>
              )
            }
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
              teamUser.userRole && teamUser.userRole.trim() !== "" ? (
                teamUser.userRole
              ) : (
                <span className="text-gray-500 italic">"Undefined"</span>
              )
            }
            className={clsx("w-fit p-2 text-left text-xs")}
            headerClassName={clsx(
              "border-b border-gray-200 bg-sky-50 text-left p-2 text-xs font-medium text-gray-500",
              "dark:text-gray-400",
              "dark:border-gray-500"
            )}
            sortable
          ></Column>
          {!showLeaderOnly && (
            <Column
              header=""
              body={(teamUser) => (
                <div>
                  <TeamMemberTableActionMenu
                    member={teamUser.user}
                    team={team}
                    memberRole={
                      teamUser.userRole && teamUser.userRole.trim() !== ""
                        ? teamUser.userRole
                        : "Member"
                    }
                  />
                </div>
              )}
              className={clsx("w-fit p-2 text-left text-xs")}
              headerClassName={clsx(
                "border-b border-gray-200 bg-sky-50 text-left p-2 text-xs font-medium text-gray-500",
                "dark:text-gray-400",
                "dark:border-gray-500"
              )}
            ></Column>
          )}
        </DataTable>
      )}
    </div>
  );
}
