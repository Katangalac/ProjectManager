import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { User } from "@/types/User";
import UserProfilePhoto from "../profile/UserProfilePhoto";
import { clsx } from "clsx";

/**
 * Propriétés du UsersTable
 * - users: la liste des users à afficher dans la table
 */
type UsersTableProps = {
  users: User[];
  title?: string;
};

/**
 * Affiche les users dans une table
 * @param {UsersTableProps} param0 - Propriétés du UsersTable
 */
export default function UsersTable({
  users,
  title = "Users list",
}: UsersTableProps) {
  return (
    <div className={clsx("flex max-h-[600px] w-full")}>
      <DataTable
        value={users}
        emptyMessage="No users"
        scrollable
        scrollHeight="500px"
        className={clsx(
          "w-full rounded-sm border border-gray-200 text-black",
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
            {title}
          </div>
        }
      >
        <Column
          field="userName"
          header="Username"
          body={(user: User) => (
            <div className={clsx("flex items-center justify-start gap-2")}>
              <UserProfilePhoto
                key={user.id}
                userId={user.id}
                imageUrl={user.imageUrl}
                username={user.userName}
                email={user.email}
                className="ring-1 ring-white"
                imagefallback={
                  user.firstName && user.lastName
                    ? `${user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()}`
                    : undefined
                }
                imageClassName="text-[10px]"
                size="size-12"
                showOnlineStatus={true}
              />
              <span>{user.userName}</span>
            </div>
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
          field="firstName"
          header="FirstName"
          body={(user: User) => user.firstName || '"None"'}
          className={clsx("w-fit truncate p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50 text-left p-2 text-xs font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>

        <Column
          field="lastName"
          header="LastName"
          body={(user: User) => user.lastName || '"None"'}
          className={clsx("w-fit truncate p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50 text-left p-2 text-xs font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>

        <Column
          field="email"
          header="Email"
          body={(user: User) => user.email}
          className={clsx("w-fit truncate p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50 text-left p-2 text-xs font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>

        <Column
          field="profession"
          header="Profession"
          body={(user: User) => user.profession || '"None"'}
          className={clsx("w-fit truncate p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50 text-left p-2 text-xs font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>

        <Column
          field="phoneNumber"
          header="Phone number"
          body={(user: User) => user.phoneNumber || '"None"'}
          className={clsx("w-fit truncate p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50 text-left p-2 text-xs font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
          sortable
        ></Column>

        {/* <Column
          header="Actions"
          body={(task) => <TaskActionMenu task={task} />}
          className={clsx("w-fit p-2 text-left text-xs")}
          headerClassName={clsx(
            "border-b border-gray-200 bg-sky-50  text-left text-xs p-2 font-bold text-gray-500",
            "dark:text-gray-400",
            "dark:border-gray-500"
          )}
        ></Column> */}
      </DataTable>
    </div>
  );
}
