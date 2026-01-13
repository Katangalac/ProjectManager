import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";
import { ReactNode } from "react";

/**
 * Propriétés du NoItems
 *
 *  - message : le message à afficher
 *  - iconSize : la taille de l'icone;
 *  - textStyle : le style de texte;
 *  - hideIcon : masquer ou afficher l'icone;
 *  - className : le style du composant;
 *  - icon?: l'icone à afficher;
 */
type NoItemsProps = {
  message?: string;
  iconSize?: string;
  textStyle?: string;
  hideIcon?: boolean;
  className?: string;
  icon?: ReactNode;
};

/**
 * Affiche un message indiquant qu'il n'y a pas d'éléments disponibles
 *
 * @param {NoItemsProps} param0 - propriétés du composant
 */
export default function NoItems({
  message = "No items",
  iconSize = "size-9 stroke-1",
  textStyle = "text-gray-400",
  className = "",
  icon,
  hideIcon = false,
}: NoItemsProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className,
        textStyle
      )}
    >
      {!hideIcon && <>{icon ? { icon } : <Inbox className={cn(iconSize)} />}</>}

      <span>{message}</span>
    </div>
  );
}
