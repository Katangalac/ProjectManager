import { clsx } from "clsx";
import { TeamWithRelations } from "@/types/Team";
import TeamMembersTable from "./TeamMembersTable";
import { InputText } from "../ui/InputText";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useUserStore } from "@/stores/userStore";
import InviteUser from "../user/InviteUsers";
import { useUserTeamRole } from "@/hooks/queries/team/useUserTeamRole";

/**
 * Propriétés du TeamMembersView
 *
 *  - team : l'équipe dont on veut afficher les membres
 */
type TeamMembersViewProps = {
  team: TeamWithRelations;
};

/**
 * Affiche les membres d'une équipe
 * Affiche les memebres dans différentes tables
 *
 * @param {TeamMembersViewProps} param0 - Propriétés du TeamMembersView
 */
export default function TeamMembersView({ team }: TeamMembersViewProps) {
  const { user } = useUserStore();
  const { data: userRole } = useUserTeamRole(team.id, user!.id);
  const roles = ["Leader", "Manager"];
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className={clsx("w-[90%] py-5")}>
      <div className={clsx("flex w-full items-center justify-between")}>
        <span
          className={clsx(
            "flex cursor-pointer items-center gap-1 text-sm font-medium text-gray-400",

            user &&
              userRole &&
              roles.includes(userRole.data) &&
              "text-sky-500 hover:text-sky-600 hover:underline"
          )}
          onClick={() => {
            if (user && userRole && roles.includes(userRole.data)) {
              setShowDialog(true);
            }
          }}
        >
          <PlusIcon className={clsx("size-3.5 stroke-3")} /> Add members
        </span>
        <div className={clsx("hidden w-70")}>
          <InputText
            className={clsx(
              "rounded-sm border border-gray-300 px-8 py-1.5 text-sm text-gray-700 placeholder:text-gray-500"
            )}
            title="Search members"
            icon={<MagnifyingGlassIcon className="size-4 stroke-2" />}
            iconPosition="left"
            placeholder="Search members..."
          />
        </div>
      </div>
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>Leaders</AccordionTrigger>
          <AccordionContent>
            <TeamMembersTable showLeaderOnly={true} team={team} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Members</AccordionTrigger>
          <AccordionContent>
            <TeamMembersTable showLeaderOnly={false} team={team} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className={clsx(
            "max-w-[500px] p-0",
            "[&>button]:text-white",
            "[&>button]:hover:text-white"
          )}
        >
          <DialogHeader className="rounded-t-md bg-sky-500 px-4 py-4">
            <DialogTitle className="text-lg text-white">
              Add member to "{team.name}"
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
            <InviteUser
              senderId={user!.id}
              teamId={team.id}
              onSuccess={() => setShowDialog(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
