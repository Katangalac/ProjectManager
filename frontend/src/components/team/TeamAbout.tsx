import { clsx } from "clsx";
import { TeamWithRelations } from "@/types/Team";
import { dateToLongString } from "@/utils/dateUtils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import UserProfilePhoto from "../profile/UserProfilePhoto";

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
                  <UserProfilePhoto
                    userId={team.user.id}
                    imageUrl={team.user.imageUrl}
                    email={team.user.email}
                    username={team.user.userName}
                    showOnlineStatus={true}
                    imagefallback={
                      team.user.firstName && team.user.lastName
                        ? `${team.user.firstName[0].toUpperCase() + team.user.lastName[0].toUpperCase()}`
                        : undefined
                    }
                    imageClassName="text-sm"
                    size="size-12"
                  />
                  <div></div>
                  <div
                    className={clsx(
                      "flex flex-col items-start justify-start gap-1"
                    )}
                  >
                    <span className={clsx("text-sm text-gray-500")}>
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
                    <span className={clsx("text-sm text-gray-500")}>
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
                    <span className={clsx("text-sm text-gray-500")}>
                      Username
                    </span>

                    <span>{team.user.userName}</span>
                  </div>
                  <div
                    className={clsx(
                      "flex flex-col items-start justify-start gap-1"
                    )}
                  >
                    <span className={clsx("text-sm text-gray-500")}>Email</span>
                    <span className={clsx("text-sm")}>{team.user.email}</span>
                  </div>

                  <div
                    className={clsx(
                      "flex flex-col items-start justify-start gap-1"
                    )}
                  >
                    <span className={clsx("text-sm text-gray-500")}>
                      Profession
                    </span>
                    <span className={clsx("text-sm")}>
                      {team.user.profession || "Unknown"}
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
