import { Menu } from "primereact/menu";
import { useRef } from "react";
import { clsx } from "clsx";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { PencilSimpleLineIcon } from "@phosphor-icons/react";
import { TeamWithRelations } from "../../types/Team";
import { MenuItem } from "primereact/menuitem";
import { useUserStore } from "../../stores/userStore";
import { useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { User } from "@/types/User";
import UpdateTeamMemberRoleForm from "./UpdateTeamMemberRole";
import { useUserTeamRole } from "@/hooks/queries/team/useUserTeamRole";

type TeamMemberActionMenuProps = {
  team: TeamWithRelations;
  member: User;
  memberRole: string;
};

/**
 * Menu d'actions réalisables pour un membre d'une équipe
 *
 * @param {TeamActionMenuProps} param0 - propriétés du menu
 */
export default function TeamMemberTableActionMenu({
  team,
  member,
  memberRole,
}: TeamMemberActionMenuProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<ReactNode | null>(null);
  const [dialogTitle, setDialogTitle] = useState("");
  //   const [dialogStyle, setDialogStyle] = useState<string | null>(null);
  const [dialogHeaderStyle, setDialogHeaderStyle] = useState<string | null>(
    null
  );
  const roles = ["Leader", "Manager"];
  const { user } = useUserStore();
  const { data: userRole } = useUserTeamRole(team.id, user!.id);

  const menu = useRef<Menu>(null);

  const menuItems: MenuItem[] = [
    {
      label: "Options",
      className: "px-2 py-2 font-medium",
      items: [
        {
          label: "Change role",
          icon: (
            <PencilSimpleLineIcon
              size={16}
              weight="regular"
              className={clsx("stroke-1.5 mr-1")}
            />
          ),
          className:
            "px-2 py-1.5 hover:bg-sky-100 dark:hover:bg-gray-700 myMenu",
          command: () => {
            if (user && userRole && roles.includes(userRole.data)) {
              setDialogTitle("Edit team");
              setDialogContent(
                <UpdateTeamMemberRoleForm
                  team={team}
                  user={member}
                  memberRole={memberRole}
                  onSuccess={() => setShowDialog(false)}
                />
              );
              setShowDialog(true);
            } else {
              setDialogTitle("Alert!");
              setDialogContent(
                <div>
                  You don’t have the required role to perform this action.
                </div>
              );
              setDialogHeaderStyle("bg-red-500");
              setShowDialog(true);
            }
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
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={(event) => {
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
        </TooltipTrigger>
        <TooltipContent>Options</TooltipContent>
      </Tooltip>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className={clsx(
            "max-w-[500px] p-0",
            "[&>button]:text-white",
            "[&>button]:hover:text-white"
          )}
        >
          <DialogHeader
            className={clsx(
              "rounded-t-md bg-sky-500 px-4 py-4",
              dialogHeaderStyle
            )}
          >
            <DialogTitle className="text-lg text-white">
              {dialogTitle}
            </DialogTitle>
          </DialogHeader>
          <div
            className={clsx(
              "max-h-[80vh] overflow-y-auto rounded-b-md py-4 pl-4",
              "[&::-webkit-scrollbar]:w-0",
              "[&::-webkit-scrollbar-track]:rounded-md",
              "[&::-webkit-scrollbar-thumb]:rounded-md"
            )}
          >
            {dialogContent}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
