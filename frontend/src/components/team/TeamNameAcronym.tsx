import { clsx } from "clsx";
import { getAcronymeFromName } from "../../utils/stringUtils";
import { cn } from "@/lib/utils";

/**
 * Propriétés du TeamNameAcronym
 *  - name : nom de l'équipe
 *  - textClassName : style css pour le texte
 *  - className : style css pour le TeamNameAcronym
 *  - onClick : fonction appelée lors d'un click sur le TeamNameAcronym
 */
type TeamNameAcronymProps = {
  name: string;
  textClassName?: string;
  className?: string;
  onClick?: () => void;
};

/**
 * Affiche l'acronyme du nom de l'équipe dans une petite carte
 *
 * @param {TeamNameAcronymProps} param0 - Propriétés du TeamNameAcronym
 */
export default function TeamNameAcronym({
  name,
  onClick,
  className,
  textClassName,
}: TeamNameAcronymProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md bg-sky-600",
        "h-16 w-fit",
        className
      )}
      onClick={onClick}
    >
      <span className={clsx("text-lg font-medium text-white", textClassName)}>
        {getAcronymeFromName(name)}
      </span>
    </div>
  );
}
