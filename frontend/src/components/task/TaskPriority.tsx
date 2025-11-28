import { priorityLevelHelper } from "../../utils/priorityLevelHelper";
import { clsx } from "clsx";

import { FlagPennantIcon } from "@phosphor-icons/react";

/**
 * Propriétés du TaskPriorityProps
 */
type TaskPriorityProps = {
  priorityLevel: number;
};

/**
 * Affiche le niveau de priorité d'une tâche avec son label et sa couleur associée
 *
 * @param {TaskPriorityProps} param0 - Propriétés du TaskPriorityProps
 * @returns - Le composant affichant le niveau de priorité
 */
export default function TaskPriority({ priorityLevel }: TaskPriorityProps) {
  const priorityLevelItems = priorityLevelHelper[priorityLevel];

  return (
    <div className={clsx("flex w-full items-center justify-start gap-2")}>
      <FlagPennantIcon
        weight="fill"
        className={clsx("size-4", priorityLevelItems.style)}
      />
      <span
        className={clsx(
          "flex h-fit w-fit items-center justify-center p-1",
          "rounded-sm",
          "text-xs font-medium",
          priorityLevelItems.style
        )}
      >
        {priorityLevelItems.label}
      </span>
    </div>
  );
}
