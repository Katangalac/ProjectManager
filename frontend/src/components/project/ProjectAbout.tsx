import { clsx } from "clsx";
import { ProjectWithRelation } from "@/types/Project";
import { dateToLongString } from "@/utils/dateUtils";
import UserBasicInfo from "../profile/UserBasicInfo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Propriétés du ProjectAbout
 *
 * - project: le projet dont on veut afficher les informations
 */
type ProjectAboutProps = {
  project: ProjectWithRelation;
};

/**
 * Affiche les informations sur une équipe
 *
 * @param {ProjectAboutProps} param0 - Propriétés du ProjectAbout
 */
export default function ProjectAbout({ project }: ProjectAboutProps) {
  return (
    <div className="flex w-[80%] flex-col items-start justify-start py-5">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="item-2" className="mb-3">
          <AccordionTrigger className="data-[state=open]:underline data-[state=open]:underline-offset-4">
            Description
          </AccordionTrigger>
          <AccordionContent>
            <div className={clsx("flex w-full justify-start")}>
              <p className="text-sm text-black">{project.description}</p>
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
              <span className="flex flex-col items-start justify-start gap-1 text-sm font-medium text-sky-600">
                Creator :
                {project.user ? (
                  <UserBasicInfo
                    user={project.user}
                    avatarImageSize="size-12"
                  />
                ) : (
                  "Unknown"
                )}
              </span>
              <span className="text-sm text-black">
                Started on {dateToLongString(new Date(project.createdAt))}
              </span>
              <span className="text-sm text-black">
                Last update on {dateToLongString(new Date(project.updatedAt))}
              </span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
