import { clsx } from "clsx";
import { getAcronymeFromName } from "../../utils/stringUtils";
import { cn } from "@/lib/utils";
import { stringToColor } from "../../utils/stringUtils";
import { colors } from "@/lib/constants/color";
import { useMemo } from "react";

/**
 * Propriétés du TeamNameAcronym
 *  - name : nom de l'équipe
 *  - textClassName : style css pour le texte
 *  - className : style css pour le TeamNameAcronym
 *  - onClick : fonction appelée lors d'un click sur le TeamNameAcronym
 */
type TeamNameAcronymProps = {
  id: string;
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
  id,
  name,
  onClick,
  className,
  textClassName,
}: TeamNameAcronymProps) {
  const bgColor = useMemo(() => {
    return stringToColor(id, colors);
  }, [id]);
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md",
        "h-16 w-fit",
        className
      )}
      onClick={onClick}
      style={{ backgroundColor: bgColor }}
    >
      <span className={clsx("text-lg font-medium text-white", textClassName)}>
        {getAcronymeFromName(name)}
      </span>
    </div>
  );
}
