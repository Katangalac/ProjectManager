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
  const priorityLevelMeta = priorityLevelHelper[priorityLevel];

  return (
    <div
      className={clsx(
        "flex w-fit items-center justify-start gap-2",
        "rounded-sm"
      )}
    >
      <FlagPennantIcon
        weight="fill"
        className={clsx("size-4", priorityLevelMeta.textStyle)}
      />
      <span
        className={clsx(
          "flex h-fit w-fit items-center justify-center py-0.5 pr-1",
          "rounded-sm",
          "text-xs font-medium",
          priorityLevelMeta.textStyle
        )}
      >
        {priorityLevelMeta.label} Priority
      </span>
    </div>
  );
}
