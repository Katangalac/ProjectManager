import { clsx } from "clsx";
import { TeamWithRelations } from "@/types/Team";
import { dateToLongString, timeAgo } from "@/utils/dateUtils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Propriétés du TeamAbout
 *
 * - team : l'équipe dont on veut afficher la carte
 */
type TeamAboutProps = {
  team: TeamWithRelations;
};

/**
 * Affiche les informations sur une équipe
 *
 * @param {TeamAboutProps} param0 - Propriétés du TeamAbout
 */
export default function TeamAbout({ team }: TeamAboutProps) {
  return (
    <div className="flex w-[80%] flex-col items-start justify-start py-5">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="item-1" className="mb-3">
          <AccordionTrigger className="data-[state=open]:underline data-[state=open]:underline-offset-4">
            Owner
          </AccordionTrigger>
          <AccordionContent>
            <div className={clsx("grid grid-cols-2 gap-x-3 gap-y-5")}>
              {team.user ? (
                <>
                  <div
                    className={clsx(
                      "flex flex-col items-start justify-start gap-1"
                    )}
                  >
                    <span className={clsx("text-sm font-medium text-sky-700")}>
                      Firstname
                    </span>
                    <span className={clsx("text-sm")}>
                      {team.user.firstName || "Unkown"}
                    </span>
                  </div>
                  <div
                    className={clsx(
                      "flex flex-col items-start justify-start gap-1"
                    )}
                  >
                    <span className={clsx("text-sm font-medium text-sky-600")}>
                      Lastname
                    </span>
                    <span className={clsx("text-sm")}>
                      {team.user.lastName || "Unkown"}
                    </span>
                  </div>
                  <div
                    className={clsx(
                      "flex flex-col items-start justify-start gap-1"
                    )}
                  >
                    <span className={clsx("text-sm font-medium text-sky-600")}>
                      Username
                    </span>
                    <span className={clsx("text-sm")}>
                      {team.user.userName}
                    </span>
                  </div>
                  <div
                    className={clsx(
                      "flex flex-col items-start justify-start gap-1"
                    )}
                  >
                    <span className={clsx("text-sm font-medium text-sky-600")}>
                      Email
                    </span>
                    <span className={clsx("text-sm")}>{team.user.email}</span>
                  </div>

                  <div
                    className={clsx(
                      "flex flex-col items-start justify-start gap-1"
                    )}
                  >
                    <span className={clsx("text-sm font-medium text-sky-600")}>
                      Profession
                    </span>
                    <span className={clsx("text-sm")}>
                      {team.user.profession || "Unknown"}
                    </span>
                  </div>

                  <div
                    className={clsx(
                      "flex flex-col items-start justify-start gap-1"
                    )}
                  >
                    <span className={clsx("text-sm font-medium text-sky-600")}>
                      Last login
                    </span>
                    <span className={clsx("text-sm")}>
                      {team.user.lastLoginAt
                        ? timeAgo(new Date(team.user.lastLoginAt))
                        : "Unknown"}
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-sm font-medium text-gray-500">
                  Unknown
                </span>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="mb-3">
          <AccordionTrigger className="data-[state=open]:underline data-[state=open]:underline-offset-4">
            Description
          </AccordionTrigger>
          <AccordionContent>
            <div className={clsx("flex w-full justify-start")}>
              <p className="text-sm text-black">{team.description}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="mb-3">
          <AccordionTrigger className="data-[state=open]:underline data-[state=open]:underline-offset-4">
            Creation infos
          </AccordionTrigger>
          <AccordionContent>
            <div
              className={clsx("flex flex-col items-start justify-start gap-2")}
            >
              <span className="text-sm text-black">
                Created on {dateToLongString(new Date(team.createdAt))}
              </span>
              <span className="text-sm text-black">
                Last update on {dateToLongString(new Date(team.updatedAt))}
              </span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
