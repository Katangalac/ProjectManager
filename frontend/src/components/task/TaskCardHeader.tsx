import { clsx } from "clsx";
import TaskActionMenu from "./TaskActionMenu";
import { TaskWithRelations } from "../../types/Task";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type TaskCardHeaderProps = {
  task: TaskWithRelations;
  flipped: boolean;
  onArrowButtonClick: () => void;
};

/**
 * En-tete du TaskCard
 */
export default function TaskCardHeader({
  task,
  onArrowButtonClick,
  flipped,
}: TaskCardHeaderProps) {
  return (
    <div
      className={clsx("flex w-full flex-col items-start justify-center gap-2")}
    >
      <div className="flex w-full items-center justify-between gap-3">
        <span
          className={clsx(
            "truncate text-xs font-medium text-gray-700",
            "dark:text-white"
          )}
          title={task.title}
        >
          {task.title}
        </span>
        <div className={clsx("flex w-fit gap-1")}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onArrowButtonClick();
                }}
                className={clsx("cursor-pointer")}
              >
                <ArrowsRightLeftIcon
                  className={clsx(
                    "size-3 stroke-1 text-gray-800 hover:stroke-2"
                  )}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {!flipped ? "Show description" : "Show main infos"}s
            </TooltipContent>
          </Tooltip>

          <TaskActionMenu task={task} />
        </div>
      </div>
      <div
        className={clsx("w-full border-t border-dotted border-gray-400")}
      ></div>
    </div>
  );
}
