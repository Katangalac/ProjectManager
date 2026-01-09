import { clsx } from "clsx";
import { TeamWithRelations } from "@/types/Team";
import TeamMembersTable from "./TeamMembersTable";
import { InputText } from "../ui/InputText";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  return (
    <div className={clsx("w-[90%] py-5")}>
      <div className={clsx("flex w-full items-center justify-between")}>
        <span
          className={clsx(
            "flex cursor-pointer items-center gap-1 text-sm font-medium text-sky-500 hover:text-sky-600",
            "hover:underline"
          )}
        >
          <PlusIcon className={clsx("size-3.5 stroke-3")} /> Add members
        </span>
        <div className={clsx("w-70")}>
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
    </div>
  );
}
