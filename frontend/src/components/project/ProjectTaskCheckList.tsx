import { TaskWithRelations } from "@/types/Task";
import { CircleIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { clsx } from "clsx";
import NoItems from "../commons/NoItems";
import { useUpdateTask } from "@/hooks/mutations/task/useUpdateTask";
import TaskActionMenu from "../task/TaskActionMenu";
import { formatShortDateWithOptionalYear } from "@/utils/dateUtils";

type ProjectTaskCheckListProps = {
  tasks: TaskWithRelations[];
  hideSeeAllButton?: boolean;
  onSeeMore?: () => void;
};

/**Affiche les taches d'un projet dans un checklist */
export default function ProjectTaskCheckList({
  tasks,
  hideSeeAllButton = false,
  onSeeMore,
}: ProjectTaskCheckListProps) {
  const { updateTask } = useUpdateTask();
  const toggleTaskStatus = (task: TaskWithRelations) => {
    const newStatus = task.status === "COMPLETED" ? "TODO" : "COMPLETED";
    updateTask({ taskId: task.id, data: { status: newStatus } });
  };
  // tasks.sort(
  //   (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  // );
  return (
    <div
      className={clsx(
        "flex h-full w-full flex-col rounded-sm border border-gray-300 pb-1"
      )}
    >
      {/**Header */}
      <div
        className={clsx(
          "flex h-fit w-full items-center justify-start px-2 py-3",
          "rounded-t-sm bg-sky-50"
        )}
      >
        <span className={clsx("text-left text-sm font-medium text-black")}>
          Tasks check list
        </span>
      </div>

      <div className={clsx("flex flex-1 flex-col gap-4")}>
        {/**Content wrapper */}
        <div
          className={clsx(
            "flex w-full flex-1 flex-col",
            tasks.length === 0 && "items-center justify-center"
          )}
        >
          {tasks.length > 0 ? (
            <div
              className={clsx(
                "max-h-[500px] flex-1 overflow-y-auto px-2",
                "[&::-webkit-scrollbar]:w-0"
              )}
            >
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={clsx(
                    "flex h-fit w-full items-center gap-1 py-2",
                    "border-b border-dotted border-gray-400 last:border-b-0"
                  )}
                >
                  {task.status === "COMPLETED" ? (
                    <CheckCircleIcon
                      weight="fill"
                      className={clsx(
                        "size-4 stroke-1 text-green-500",
                        "cursor-pointer"
                      )}
                      onClick={() => toggleTaskStatus(task)}
                    />
                  ) : (
                    <CircleIcon
                      weight="regular"
                      className={clsx(
                        "size-4 stroke-1 text-gray-500",
                        "cursor-pointer"
                      )}
                      onClick={() => toggleTaskStatus(task)}
                    />
                  )}
                  <div
                    className={clsx("flex flex-1 items-center justify-between")}
                  >
                    <span
                      className={clsx(
                        "line-clamp-2 text-left text-[13px] text-wrap text-gray-800",
                        task.status === "COMPLETED"
                          ? "text-gray-500 line-through"
                          : ""
                      )}
                    >
                      {task.title}
                    </span>

                    <div className={clsx("flex gap-4")}>
                      <span
                        className={clsx(
                          "flex text-left text-[10px] text-wrap text-gray-600"
                        )}
                      >
                        {formatShortDateWithOptionalYear(
                          new Date(task.deadline)
                        )}
                        {/* {new Date(task.deadline).toISOString().split("T")[0]} */}
                      </span>
                      <span className={clsx("rotate-90 transform")}>
                        <TaskActionMenu task={task} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <NoItems
              message="No tasks available"
              textStyle="text-sm font-medium text-gray-400"
            />
          )}
        </div>

        {/**Footer */}
        <div
          className={clsx(
            "h-fit w-full px-2 pb-3",
            hideSeeAllButton && "hidden"
          )}
        >
          <button
            onClick={onSeeMore}
            className={clsx(
              "flex w-full cursor-pointer justify-center px-2 py-1",
              "rounded-md border border-gray-300",
              "hover:bg-gray-100 hover:text-gray-700",
              "text-sm text-gray-500"
            )}
          >
            See all
          </button>
        </div>
      </div>
    </div>
  );
}
