import { Menu } from "primereact/menu";
import { useRef } from "react";
import { clsx } from "clsx";
import {
  PencilIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { UserCircleMinusIcon } from "@phosphor-icons/react";
import { TeamWithRelations } from "../../types/Team";
import { MenuItem } from "primereact/menuitem";
import { Dialog } from "primereact/dialog";
import { useUserStore } from "../../stores/userStore";
import { useState, ReactNode } from "react";
import TeamForm from "./TeamForm";

// import TaskDetails from "./TaskDetails";
// import TaskForm from "./TaskForm";

/**
 * Propriétés du menu d'une équipe
 *
 * - team: l'équipe concernée par le menu
 */
type TeamActionMenuProps = {
  team: TeamWithRelations;
};

/**
 * Menu d'actions réalisables pour une équipe
 *
 * @param {TeamActionMenuProps} param0 - propriétés du menu
 */
export default function TeamActionMenu({ team }: TeamActionMenuProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<ReactNode | null>(null);
  const [dialogTitle, setDialogTitle] = useState("");
  const { user } = useUserStore();
  const menu = useRef<Menu>(null);

  const menuItems: MenuItem[] = [
    {
      label: "Options",
      className: "px-2 py-2 font-medium",
      items: [
        {
          label: "Edit",
          icon: <PencilIcon className={clsx("stroke-1.5 mr-1 size-4")} />,
          className: "px-2 py-1 hover:bg-sky-100 dark:hover:bg-gray-700 myMenu",
          command: () => {
            if (user && team.leaderId && user.id === team.leaderId) {
              setDialogTitle("Edit team");
              setDialogContent(
                <TeamForm
                  isUpdateForm={true}
                  onSuccess={() => setShowDialog(false)}
                  defaultValues={team}
                />
              );
              setShowDialog(true);
            } else {
              setDialogTitle("Alert");
              setDialogContent(<div>You can not edit this team</div>);
              setShowDialog(true);
            }
          },
        },
        {
          label: "Leave this team",
          icon: (
            <UserCircleMinusIcon
              weight="regular"
              className={clsx("stroke-1.5 mr-1 size-4")}
            />
          ),
          className: "px-2 py-1 hover:bg-sky-100 dark:hover:bg-gray-700 myMenu",
          command: () => {
            // Action pour desassigner la tâche
          },
        },
      ],
    },
  ];

  return (
    <div className={clsx("justify-content-center flex w-fit")}>
      <Menu
        model={menuItems}
        popup
        ref={menu}
        id={`${team.id}`}
        popupAlignment="left"
        className={clsx(
          "min-w-35 rounded-md border border-gray-300 bg-white shadow-lg",
          "dark:border-gray-600 dark:bg-gray-900",
          "text-xs text-gray-700",
          "dark:text-gray-300"
        )}
      />
      <button
        title="Options"
        onClick={(event) => {
          event.stopPropagation();
          menu.current?.toggle(event);
        }}
      >
        <EllipsisHorizontalIcon
          className={clsx(
            "size-6 cursor-pointer text-gray-500 hover:stroke-2",
            "dark:text-white"
          )}
        />
      </button>
      <Dialog
        header={dialogTitle}
        visible={showDialog}
        style={{ width: "40vw" }}
        modal
        onHide={() => setShowDialog(false)}
        className={clsx(
          "min-w-fit gap-5 rounded-lg border border-gray-300 bg-white p-5 text-sm",
          "dark:border-gray-600 dark:bg-gray-900",
          "text-gray-700 dark:text-gray-300",
          "myDialog"
        )}
      >
        {dialogContent}
      </Dialog>
    </div>
  );
}
